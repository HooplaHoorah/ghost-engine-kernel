#!/usr/bin/env node
/**
 * scripts/warmup.js
 * One command to validate demo readiness.
 *
 * Env: API_BASE_URL
 */
const base = process.env.API_BASE_URL;
if (!base) {
  console.error("API_BASE_URL is required");
  process.exit(2);
}

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

async function fetchText(url) {
  const res = await fetch(url);
  const text = await res.text();
  return { res, text };
}

async function assertJsonUrl(name, url) {
  const { res, text } = await fetchText(url);
  if (!res.ok) throw new Error(`[${name}] HTTP ${res.status} body=${text.slice(0,200)}`);
  JSON.parse(text);
}

async function assertTextUrl(name, url) {
  const { res, text } = await fetchText(url);
  if (!res.ok) throw new Error(`[${name}] HTTP ${res.status} body=${text.slice(0,200)}`);
  if (!text || text.length < 1) throw new Error(`[${name}] empty body`);
}

async function waitDone(jobId, maxMs=120000) {
  const start = Date.now();
  let last = null;
  while (Date.now() - start < maxMs) {
    const s = await http(`/status/${jobId}`);
    if (!s.res.ok) throw new Error(`status ${s.res.status}: ${s.text}`);
    last = s.json;
    if (last?.status === "done") return last;
    if (last?.status === "failed") throw new Error(`job failed: ${JSON.stringify(last)}`);
    await sleep(1000);
  }
  throw new Error(`timeout waiting for done; last=${JSON.stringify(last)}`);
}

async function main() {
  console.log("=== /healthz ===");
  const hz = await http("/healthz");
  console.log(hz.json || hz.text);

  const prompt = "Three rooms, locked exit, key";
  const seed = 12345;
  console.log("=== generating warmup job ===");
  const gen = await http("/generate-scene", {
    method:"POST",
    body: JSON.stringify({ prompt, plugin:"doom-bridge", seed })
  });
  if (!gen.res.ok) throw new Error(`generate failed: ${gen.res.status} ${gen.text}`);

  const jobId = gen.json?.jobId || gen.json?.id;
  if (!jobId) throw new Error("missing jobId");

  const done = await waitDone(jobId);
  const r = done.result || {};

  console.log("=== warmup complete ===");
  console.log("jobId:", jobId);
  console.log("seed:", done.seed || r.seed || seed);
  console.log("share:", `${base}/demo?jobId=${jobId}`);

  // Validate URLs if present
  if (r.sceneGraphUrl) await assertJsonUrl("sceneGraphUrl", r.sceneGraphUrl);
  if (r.levelSpecUrl) await assertJsonUrl("levelSpecUrl", r.levelSpecUrl);
  if (r.asciiMinimapUrl) await assertTextUrl("asciiMinimapUrl", r.asciiMinimapUrl);
  if (r.levelPreviewAsciiUrl) await assertTextUrl("levelPreviewAsciiUrl", r.levelPreviewAsciiUrl);

  console.log("Warmup OK");
}

main().catch(e => { console.error("Warmup failed:", e); process.exit(1); });
