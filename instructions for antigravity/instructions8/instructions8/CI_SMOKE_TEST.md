# CI Smoke Test (post-deploy)

## Goal
After deployment, run an integration test against the live API (ALB).

## Smoke script (Node 18+)
Create `scripts/smoke.mjs`:

```js
const base = process.env.API_BASE_URL;
if (!base) throw new Error("API_BASE_URL is required");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function http(path, opts) {
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: { "content-type": "application/json", ...(opts?.headers || {}) },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  return { res, text, json };
}

async function main() {
  // 1) docs
  {
    const { res } = await http("/openapi.json", { method: "GET" });
    if (!res.ok) throw new Error(`/openapi.json failed: ${res.status}`);
  }

  // 2) generate
  const prompt = "A tiny dungeon with 3 rooms and a key behind a locked door";
  const gen = await http("/generate-scene", {
    method: "POST",
    body: JSON.stringify({ prompt, plugin: "stub" }),
  });
  if (!gen.res.ok) throw new Error(`/generate-scene failed: ${gen.res.status} ${gen.text}`);
  const jobId = gen.json?.jobId || gen.json?.id;
  if (!jobId) throw new Error(`Missing jobId: ${gen.text}`);

  // 3) poll status
  const maxMs = 120000;
  const start = Date.now();
  let status;
  while (Date.now() - start < maxMs) {
    const s = await http(`/status/${jobId}`, { method: "GET" });
    if (!s.res.ok) throw new Error(`/status/${jobId} failed: ${s.res.status} ${s.text}`);
    status = s.json;
    if (status?.status === "done" || status?.status === "failed") break;
    await sleep(1500);
  }
  if (!status) throw new Error("No status returned");
  if (status.status !== "done") throw new Error(`Job not done: ${JSON.stringify(status)}`);

  // 4) validate steps + artifacts
  if (!Array.isArray(status.steps) || status.steps.length < 4) {
    throw new Error(`Expected >=4 steps: ${JSON.stringify(status.steps)}`);
  }
  const r = status.result || {};
  const hasInline = r.sceneGraph && r.asciiMinimap;
  const hasUrls = r.sceneGraphUrl && r.asciiMinimapUrl;
  if (!hasInline && !hasUrls) {
    throw new Error(`Missing artifacts inline or urls: ${JSON.stringify(r)}`);
  }

  // 5) /jobs contains job
  const jobs = await http("/jobs", { method: "GET" });
  if (!jobs.res.ok) throw new Error(`/jobs failed: ${jobs.res.status}`);
  const list = jobs.json?.jobs || jobs.json;
  const found = Array.isArray(list) && list.some(j => (j.jobId || j.id) === jobId);
  if (!found) throw new Error("Job not found in /jobs");

  console.log("SMOKE OK", { jobId });
}

main().catch((e) => {
  console.error("SMOKE FAILED", e);
  process.exit(1);
});
```

## Workflow wiring (example)
Add a job after deploy:

```yaml
  smoke-test:
    runs-on: ubuntu-latest
    needs: [deploy]   # adjust to your job name
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: node scripts/smoke.mjs
        env:
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
```
