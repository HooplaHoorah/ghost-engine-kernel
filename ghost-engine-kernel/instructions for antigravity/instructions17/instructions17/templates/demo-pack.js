#!/usr/bin/env node
/**
 * scripts/demo-pack.js
 *
 * Generates 3 presentation jobs and prints share links.
 *
 * Env: API_BASE_URL
 */
import crypto from "node:crypto";

const base = process.env.API_BASE_URL;
if (!base) { console.error("API_BASE_URL is required"); process.exit(2); }

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
  if (!text) throw new Error(`[${name}] empty body`);
  JSON.parse(text);
}

async function assertTextUrl(name, url) {
  const { res, text } = await fetchText(url);
  if (!res.ok) throw new Error(`[${name}] HTTP ${res.status} body=${text.slice(0,200)}`);
  if (!text) throw new Error(`[${name}] empty body`);
}

async function withBackoff(fn, tries=6) {
  let delay = 500;
  for (let i=0;i<tries;i++) {
    const out = await fn();
    if (out?.res?.status === 429 || out?.res?.status === 503) {
      await sleep(delay);
      delay = Math.min(delay * 2, 8000);
      continue;
    }
    return out;
  }
  throw new Error("too many retries (429/503)");
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
  throw new Error(`timeout; last=${JSON.stringify(last)}`);
}

function buildShare(jobId) {
  return `${base}/demo?jobId=${jobId}`;
}

const PRESETS = [
  { label:"3 rooms + key + locked exit", seed:12345, prompt:"A tiny dungeon with 3 rooms and a key behind a locked door." },
  { label:"4 rooms + ambush", seed:333, prompt:"Four small rooms; place an enemy guarding the path to the exit." },
  { label:"hub + spokes", seed:444, prompt:"A hub room connected to three side rooms; key in one side room; exit in another." },
];

async function main() {
  console.log("=== /healthz ===");
  const hz = await http("/healthz");
  console.log(hz.json || hz.text);

  const createdAt = new Date().toISOString();
  const items = [];
  let hadError = false;

  for (const p of PRESETS) {
    console.log(`\n=== generating: ${p.label} (seed ${p.seed}) ===`);

    const gen = await withBackoff(() => http("/generate-scene", {
      method:"POST",
      body: JSON.stringify({ prompt:p.prompt, plugin:"doom-bridge", seed:p.seed })
    }));

    if (!gen.res.ok) {
      hadError = true;
      console.error("generate failed:", gen.res.status, gen.text);
      continue;
    }

    const jobId = gen.json?.jobId || gen.json?.id;
    if (!jobId) {
      hadError = true;
      console.error("missing jobId");
      continue;
    }

    try {
      const done = await waitDone(jobId);
      const r = done.result || {};
      // best-effort URL validation
      try {
        if (r.levelSpecUrl) await assertJsonUrl("levelSpecUrl", r.levelSpecUrl);
        if (r.sceneGraphUrl) await assertJsonUrl("sceneGraphUrl", r.sceneGraphUrl);
        if (r.asciiMinimapUrl) await assertTextUrl("asciiMinimapUrl", r.asciiMinimapUrl);
        if (r.levelPreviewAsciiUrl) await assertTextUrl("levelPreviewAsciiUrl", r.levelPreviewAsciiUrl);
      } catch (e) {
        hadError = true;
        console.warn("WARN: artifact validation:", e.message);
      }

      items.push({ label:p.label, seed:p.seed, jobId });
      console.log("share:", buildShare(jobId));
    } catch (e) {
      hadError = true;
      console.error("job failed:", e.message);
    }
  }

  console.log("\n=== Demo Pack Links ===");
  for (const it of items) {
    console.log(`- ${it.label} (seed ${it.seed}): ${buildShare(it.jobId)}`);
  }

  const pack = { createdAt, items };
  console.log("\n=== Demo Pack JSON ===");
  console.log(JSON.stringify(pack, null, 2));

  process.exit(hadError ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
