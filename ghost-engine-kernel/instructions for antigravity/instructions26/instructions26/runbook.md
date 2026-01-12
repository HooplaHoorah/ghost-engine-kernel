# Browser Demo Runbook (updated)

## Target (local)
- Orchestrator: http://localhost:8080
- Worker: http://localhost:8081  ← (after Fix 1)

## Start
1) Start services using the repo’s standard command (examples):
- `npm run dev`
- OR whatever is documented in the repo root

2) Confirm health:
- `curl -s http://localhost:8080/healthz | jq .` (if jq installed; otherwise omit)
- Visit: http://localhost:8080/docs (or /openapi.json)

## Demo (browser)
1) Open: http://localhost:8080/demo
2) Use preset: **Doom** (or the closest equivalent).
3) Click **Generate**.
4) Capture:
   - job id
   - seed (if shown)
   - plugin (doom-bridge vs stub)
   - completion time (rough)
5) Confirm artifacts:
   - LevelSpec download works
   - Share link works (if present)
6) Determinism:
   - Re-run same prompt + same seed → confirm byte-identical LevelSpec (hash)
   - Re-run same prompt + different seed → confirm meaningful variation

## Known UI gaps (until Fix 2 is merged)
- If **Replay** button is broken: manually re-enter seed and regenerate.
- If **Warmup** button missing: do a fast “tiny prompt” generation first.
- If **Play** button missing: use CLI/runtime fallback:
  - Download LevelSpec artifact
  - Run the runtime command in repo (example):
    - `node ge-doom/runtime.js <path-to-levelspec.json>`
