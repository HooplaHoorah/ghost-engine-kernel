#!/usr/bin/env node
/**
 * ge-fetch <jobId>
 * Downloads levelSpec from Ghost Engine and saves to GE Doom incoming folder.
 *
 * Env:
 *   API_BASE_URL  (e.g., https://your-alb)
 *   GE_DOOM_DIR   (path to GE Doom project/build root)
 */
import fs from "node:fs";
import path from "node:path";

const base = process.env.API_BASE_URL;
const geDir = process.env.GE_DOOM_DIR || ".";

const jobId = process.argv[2];
if (!base) throw new Error("API_BASE_URL is required");
if (!jobId) throw new Error("Usage: ge-fetch <jobId>");

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function main() {
  const status = await fetchJson(`${base}/status/${jobId}`);
  if (status.status !== "done") {
    throw new Error(`Job not done: ${status.status}`);
  }
  const r = status.result || {};
  const incoming = path.join(geDir, "Levels", "incoming");
  fs.mkdirSync(incoming, { recursive: true });

  let levelSpecJson;
  if (r.levelSpecUrl) {
    levelSpecJson = await fetchText(r.levelSpecUrl);
  } else if (r.levelSpec) {
    levelSpecJson = JSON.stringify(r.levelSpec, null, 2);
  } else {
    throw new Error("No levelSpecUrl or inline levelSpec found in result");
  }

  const outPath = path.join(incoming, `${jobId}.levelSpec.json`);
  fs.writeFileSync(outPath, levelSpecJson, "utf-8");
  console.log(`Saved: ${outPath}`);

  // TODO: launch GE Doom with --levelSpec outPath
  // Example:
  //   spawnSync(path.join(geDir, "bin", "GE-Doom"), ["--levelSpec", outPath], { stdio: "inherit" });
  console.log("Next: launch GE Doom with this file (wire your engine's launch command here).");
}

main().catch((e) => {
  console.error("ge-fetch failed:", e);
  process.exit(1);
});
