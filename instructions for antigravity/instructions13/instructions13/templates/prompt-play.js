#!/usr/bin/env node
/**
 * prompt-play: generate -> poll -> ge-fetch -> (optional) launch
 *
 * Env:
 *   API_BASE_URL
 *   GE_DOOM_EXEC (only needed if --launch is passed)
 */
import { spawn } from "node:child_process";

const base = process.env.API_BASE_URL;
if (!base) throw new Error("API_BASE_URL is required");

const argv = process.argv.slice(2);
const getArg = (k) => {
  const i = argv.indexOf(k);
  if (i === -1) return null;
  return argv[i+1] ?? null;
};
const hasFlag = (k) => argv.includes(k);

const prompt = getArg("--prompt");
if (!prompt) throw new Error("Missing --prompt");
const plugin = getArg("--plugin") || "doom-bridge";
const seedRaw = getArg("--seed");
const seed = seedRaw ? Number(seedRaw) : undefined;
const launch = hasFlag("--launch");

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

async function main() {
  const body = { prompt, plugin };
  if (Number.isFinite(seed)) body.seed = seed;

  const gen = await http("/generate-scene", { method:"POST", body: JSON.stringify(body) });
  if (!gen.res.ok) throw new Error(`generate failed: ${gen.res.status} ${gen.text}`);

  const jobId = gen.json?.jobId || gen.json?.id;
  if (!jobId) throw new Error("Missing jobId from generate response");

  console.log("Job:", jobId, "polling...");
  await waitDone(jobId);
  console.log("Done. Fetching LevelSpec...");

  const fetchArgs = ["scripts/ge-fetch.js", jobId];
  if (launch) fetchArgs.push("--launch");

  const child = spawn(process.execPath, fetchArgs, { stdio:"inherit" });
  child.on("exit", (code) => process.exit(code ?? 0));
}

main().catch(e => { console.error(e); process.exit(1); });
