/**
 * External smoke test for deployed ALB.
 * Usage:
 *   API_BASE_URL="http://<alb_dns_name>" node scripts/external-smoke.mjs
 */
const base = process.env.API_BASE_URL;
if (!base) throw new Error("API_BASE_URL is required");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function http(path, opts = {}) {
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: { "content-type": "application/json", ...(opts.headers || {}) },
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { res, text, json };
}

function ok(msg) { console.log(`✅ ${msg}`); }
function fail(msg) { console.error(`❌ ${msg}`); process.exit(1); }

async function main() {
  console.log(`External smoke against: ${base}`);

  // 0) health
  {
    const { res, json, text } = await http("/healthz", { method: "GET" });
    if (!res.ok) fail(`/healthz failed: ${res.status} ${text}`);
    if (!json?.ok) fail(`/healthz missing ok:true: ${text}`);
    ok("/healthz");
  }

  // 1) assets/pages
  for (const p of ["/openapi.json", "/demo", "/play", "/play.js"]) {
    const { res, text } = await http(p, { method: "GET", headers: {} });
    if (!res.ok) fail(`${p} failed: ${res.status} ${text.slice(0, 200)}`);
    ok(p);
  }

  // 2) generate
  const prompt = "doom-bridge: a tiny dungeon with 3 rooms, a locked door, a key, and one enemy";
  const gen = await http("/generate-scene", {
    method: "POST",
    body: JSON.stringify({ prompt, plugin: "stub" }),
  });
  if (!gen.res.ok) fail(`/generate-scene failed: ${gen.res.status} ${gen.text}`);
  const jobId = gen.json?.jobId || gen.json?.id;
  if (!jobId) fail(`Missing jobId: ${gen.text}`);
  ok(`Job created: ${jobId}`);

  // 3) poll status
  const maxMs = 120000;
  const start = Date.now();
  let status = null;

  while (Date.now() - start < maxMs) {
    const s = await http(`/status/${encodeURIComponent(jobId)}`, { method: "GET" });
    if (!s.res.ok) fail(`/status failed: ${s.res.status} ${s.text}`);
    status = s.json;

    const st = status?.state || status?.status;
    if (st === "done" || st === "failed" || st === "succeeded") break;
    await sleep(1500);
  }

  if (!status) fail("No status returned");
  const st = status?.state || status?.status;
  if (st !== "done" && st !== "succeeded") fail(`Job not successful: ${JSON.stringify(status).slice(0, 500)}`);
  ok(`Job finished: ${st}`);

  // 4) LevelSpec via proxy (CORS-safe)
  {
    const p = `/artifact/${encodeURIComponent(jobId)}/levelSpec`;
    const { res, json, text } = await http(p, { method: "GET", headers: {} });
    if (!res.ok) fail(`${p} failed: ${res.status} ${text.slice(0, 200)}`);
    if (!json || typeof json !== "object") fail(`${p} not JSON`);
    ok("artifact proxy LevelSpec");
  }

  // 5) Print shareable links
  console.log("\n=== SHARE LINKS ===");
  console.log(`Demo: ${base}/demo?jobId=${jobId}`);
  console.log(`Play: ${base}/play?job=${jobId}`);
  console.log("===================\n");

  ok("EXTERNAL SMOKE OK");
}

main().catch((e) => {
  console.error("SMOKE FAILED", e);
  process.exit(1);
});
