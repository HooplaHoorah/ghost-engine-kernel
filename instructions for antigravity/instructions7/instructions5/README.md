# Ghost Engine — instructions5 (two slices)

Date: 2025-12-25

This bundle contains implementation instructions for **two incremental slices**:

1. **Slice 1 — Demo contract + plugin step registry + “wow” artifact**
   - Adds `GET /jobs` + OpenAPI docs
   - Formalizes a step pipeline (`parse_prompt`, `select_assets`, `compose_scene_graph`, `emit_level_stub`)
   - Introduces a *plugin interface* with a default `stub` plugin
   - Returns an instantly-demoable output: `sceneGraph` JSON + `asciiMinimap`

2. **Slice 2 — Persistence**
   - DynamoDB job state (so jobs survive deploys)
   - S3 artifact storage (so results are durable + shareable)
   - IAM updates for Orchestrator/Worker task roles
   - `/jobs` becomes a DynamoDB-backed listing

---

## How to use this bundle

- Drop this folder into the repo under something like `docs/instructions5/`
- Work in order:
  1) `01_slice1_demo_contract_plugin_pipeline.md`
  2) `02_slice2_persistence_dynamodb_s3.md`
  3) `03_acceptance_tests.md` (definition of done)

If you want a single “PR plan”, read `06_pr_plan.md`.

---

## Assumptions (adjust names to match your repo)

- You have **Orchestrator** + **Worker** services deployed on ECS (Fargate or EC2).
- There is a queue (often SQS) between them.
- Existing endpoints already include:
  - `POST /generate-scene`
  - `GET /status/:id`

Where names differ, keep behavior the same.

---

## Quick definition of done (Slice 1)

1. `POST /generate-scene` returns `{jobId}`
2. `GET /status/{jobId}` returns:
   - `state` transitions (queued → running → done/failed)
   - `steps[]` with per-step timing + summary
   - `result.sceneGraph` and `result.asciiMinimap`
3. `GET /jobs` lists last ~20 jobs (newest first)
4. OpenAPI (`/openapi.json` or `/docs`) renders and is accurate

Slice 2 adds persistence + S3 URLs/keys in `result`.

---

## Files

- `01_slice1_demo_contract_plugin_pipeline.md`
- `02_slice2_persistence_dynamodb_s3.md`
- `03_acceptance_tests.md`
- `04_api_shapes_and_examples.md`
- `05_terraform_notes.md`
- `06_pr_plan.md`
- `07_observability_notes.md`
