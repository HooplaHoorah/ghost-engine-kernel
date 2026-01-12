# Slice 17 Plan — Readiness Report

## A) CLI script
Add `scripts/demo-readiness-report.js` with these steps:

1) Preflight `/healthz`
   - Print JSON
   - Determine pass/fail based on:
     - ok true
     - if configured deps exist, their checks are not false

2) Mini smoke (deterministic)
   - POST `/generate-scene` with doom-bridge, seed=777, stable prompt
   - poll to done (max 120s)
   - validate artifact URLs (levelSpecUrl, sceneGraphUrl, ascii text urls) if present
   - Extract pluginVersion from result metadata

3) Demo pack
   - Option A (default): generate 3 backups sequentially (same presets as demo-pack)
   - Option B: if `--reusePack` is passed, only print instructions to use existing pack
   - Print links and JSON pack blob

4) Print a final “STATUS” line:
   - READY or NOT READY
   - list failed sections

Exit code:
- 0 if READY
- 1 if NOT READY (any critical failure)

## B) Optional GitHub Action
A workflow that runs the report on `workflow_dispatch` against staging using secrets for `API_BASE_URL`.
It should upload the full report log as an artifact.

