#!/usr/bin/env node
/**
 * backend-determinism-test.js
 * generate a doom-bridge job, replay it, hash levelSpec A and B, assert equal.
 *
 * Env: API_BASE_URL
 */
import crypto from "node:crypto";

const base = process.env.API_BASE_URL;
if (!base) throw new Error("API_BASE_URL required");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function http(path, opts={}) {
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: { "content-type":"application/json", ...(opts.headers||{}) }
  });
  const text = await res.text();
  let json=null; try{ json=JSON.parse(text);}catch{}
  return {res, text, json};
}

function canonicalize(obj) {
  if (Array.isArray(obj)) return obj.map(canonicalize);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(Object.keys(obj).sort().map(k => [k, canonicalize(obj[k])]));
  }
  return obj;
}

function sha256(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

async function waitDone(jobId, maxMs=120000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const s = await http(`/status/${jobId}`);
    if (!s.res.ok) throw new Error(`status ${s.res.status}: ${s.text}`);
    if (s.json?.status === "done") return s.json;
    if (s.json?.status === "failed") throw new Error(`job failed: ${JSON.stringify(s.json)}`);
    await sleep(1000);
  }
  throw new Error("timeout waiting for done");
}

async function fetchLevelSpec(status) {
  const r = status.result || {};
  if (r.levelSpecUrl) {
    const res = await fetch(r.levelSpecUrl);
    if (!res.ok) throw new Error(`levelSpecUrl ${res.status}`);
    return await res.json();
  }
  if (r.levelSpec) return r.levelSpec;
  throw new Error("No levelSpecUrl or inline levelSpec");
}

async function main() {
  const seed = 777;
  const gen = await http("/generate-scene", {
    method:"POST",
    body: JSON.stringify({ prompt:"Determinism test dungeon", plugin:"doom-bridge", seed })
  });
  if (!gen.res.ok) throw new Error(gen.text);
  const jobA = gen.json?.jobId || gen.json?.id;
  if (!jobA) throw new Error("missing jobId");

  const doneA = await waitDone(jobA);

  const rep = await http(`/jobs/${jobA}/replay`, { method:"POST" });
  if (!rep.res.ok) throw new Error(rep.text);
  const jobB = rep.json?.jobId || rep.json?.id;
  if (!jobB) throw new Error("missing replay jobId");

  const doneB = await waitDone(jobB);

  const specA = await fetchLevelSpec(doneA);
  const specB = await fetchLevelSpec(doneB);

  const aStr = JSON.stringify(canonicalize(specA));
  const bStr = JSON.stringify(canonicalize(specB));

  const ha = sha256(aStr);
  const hb = sha256(bStr);

  console.log("hashA:", ha);
  console.log("hashB:", hb);

  if (ha !== hb) throw new Error("Determinism FAIL: hashes differ");
  console.log("Determinism OK");
}

main().catch(e => { console.error(e); process.exit(1); });
