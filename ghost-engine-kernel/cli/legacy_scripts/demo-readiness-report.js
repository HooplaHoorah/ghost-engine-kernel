#!/usr/bin/env node
/**
 * scripts/demo-readiness-report.js
 *
 * Paste-ready readiness report for demos/judges.
 * Env: API_BASE_URL
 */
const base = process.env.API_BASE_URL;
if (!base) {
  console.error("API_BASE_URL is required");
  process.exit(2);
}

const argv = process.argv.slice(2);
const hasFlag = (k) => argv.includes(k);
const reusePack = hasFlag("--reusePack");
const noPack = hasFlag("--noPack");

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

function share(jobId) {
  return `${base}/demo?jobId=${jobId}`;
}

const PACK_PRESETS = [
  { label:"3 rooms + key + locked exit", seed:12345, prompt:"A tiny dungeon with 3 rooms and a key behind a locked door." },
  { label:"4 rooms + ambush", seed:333, prompt:"Four small rooms; place an enemy guarding the path to the exit." },
  { label:"hub + spokes", seed:444, prompt:"A hub room connected to three side rooms; key in one side room; exit in another." },
];

async function main() {
  const failed = [];
  let pluginVersion = "";

  console.log("========================================");
  console.log("GHOST ENGINE — DEMO READINESS REPORT");
  console.log("API_BASE_URL:", base);
  console.log("Time:", new Date().toISOString());
  console.log("========================================\n");

  // HEALTHZ
  console.log("=== HEALTHZ ===");
  let hzJson = null;
  try {
    const hz = await http("/healthz");
    if (!hz.res.ok) throw new Error(`healthz HTTP ${hz.res.status}`);
    hzJson = hz.json;
    console.log(JSON.stringify(hz.json ?? hz.text, null, 2));
    const conf = hz.json?.configured || {};
    const checks = hz.json?.checks || {};
    if (hz.json?.ok !== true) throw new Error("healthz ok=false");
    if (conf.JOBS_TABLE_NAME && checks.ddb === false) throw new Error("healthz ddb=false");
    if (conf.ARTIFACTS_BUCKET && checks.s3 === false) throw new Error("healthz s3=false");
    console.log("HEALTHZ: PASS\n");
  } catch (e) {
    failed.push("HEALTHZ");
    console.error("HEALTHZ: FAIL", e.message, "\n");
  }

  // MINI SMOKE
  console.log("=== MINI SMOKE (doom-bridge, seed 777) ===");
  let smokeJobId = null;
  try {
    const gen = await withBackoff(() => http("/generate-scene", {
      method:"POST",
      body: JSON.stringify({ prompt:"Readiness smoke dungeon", plugin:"doom-bridge", seed:777 })
    }));
    if (!gen.res.ok) throw new Error(`generate ${gen.res.status}: ${gen.text}`);
    smokeJobId = gen.json?.jobId || gen.json?.id;
    if (!smokeJobId) throw new Error("missing jobId");

    const done = await waitDone(smokeJobId);
    const r = done.result || {};
    pluginVersion = r.pluginVersion || r.metadata?.pluginVersion || pluginVersion || "";
    console.log("jobId:", smokeJobId);
    console.log("share:", share(smokeJobId));
    if (pluginVersion) console.log("pluginVersion:", pluginVersion);

    // validate artifacts if URLs exist
    if (r.levelSpecUrl) await assertJsonUrl("levelSpecUrl", r.levelSpecUrl);
    if (r.sceneGraphUrl) await assertJsonUrl("sceneGraphUrl", r.sceneGraphUrl);
    if (r.asciiMinimapUrl) await assertTextUrl("asciiMinimapUrl", r.asciiMinimapUrl);
    if (r.levelPreviewAsciiUrl) await assertTextUrl("levelPreviewAsciiUrl", r.levelPreviewAsciiUrl);

    console.log("MINI SMOKE: PASS\n");
  } catch (e) {
    failed.push("MINI_SMOKE");
    console.error("MINI SMOKE: FAIL", e.message);
    if (smokeJobId) console.error("jobId:", smokeJobId, "share:", share(smokeJobId));
    console.error("");
  }

  // DEMO PACK
  const createdAt = new Date().toISOString();
  const items = [];
  if (!noPack) {
    console.log("=== DEMO PACK ===");
    if (reusePack) {
      console.log("reusePack flag set: skipping pack generation.");
      console.log("Use existing pack from UI localStorage key ghost:demoPack or run demo-pack.js.");
      console.log("");
    } else {
      for (const p of PACK_PRESETS) {
        console.log(`Generating: ${p.label} (seed ${p.seed})`);
        try {
          const gen = await withBackoff(() => http("/generate-scene", {
            method:"POST",
            body: JSON.stringify({ prompt:p.prompt, plugin:"doom-bridge", seed:p.seed })
          }));
          if (!gen.res.ok) throw new Error(`generate ${gen.res.status}: ${gen.text}`);
          const jobId = gen.json?.jobId || gen.json?.id;
          if (!jobId) throw new Error("missing jobId");
          const done = await waitDone(jobId);
          const r = done.result || {};
          try {
            if (r.levelSpecUrl) await assertJsonUrl("levelSpecUrl", r.levelSpecUrl);
            if (r.sceneGraphUrl) await assertJsonUrl("sceneGraphUrl", r.sceneGraphUrl);
            if (r.asciiMinimapUrl) await assertTextUrl("asciiMinimapUrl", r.asciiMinimapUrl);
            if (r.levelPreviewAsciiUrl) await assertTextUrl("levelPreviewAsciiUrl", r.levelPreviewAsciiUrl);
          } catch (e2) {
            failed.push("DEMO_PACK_ARTIFACTS");
            console.warn("WARN: pack artifact validation:", e2.message);
          }
          items.push({ label:p.label, seed:p.seed, jobId });
          console.log("share:", share(jobId));
        } catch (e) {
          failed.push("DEMO_PACK");
          console.error("pack item failed:", p.label, e.message);
        }
      }
      const pack = { createdAt, items };
      console.log("\nDemo Pack Links:");
      for (const it of items) console.log(`- ${it.label} (seed ${it.seed}): ${share(it.jobId)}`);
      console.log("\nDemo Pack JSON:");
      console.log(JSON.stringify(pack, null, 2));
      console.log("");
    }
  }

  // FINAL STATUS
  console.log("=== FINAL STATUS ===");
  if (failed.length === 0) {
    console.log("READY ✅");
    process.exit(0);
  } else {
    console.log("NOT READY ❌");
    console.log("Failed sections:", Array.from(new Set(failed)).join(", "));
    process.exit(1);
  }
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
