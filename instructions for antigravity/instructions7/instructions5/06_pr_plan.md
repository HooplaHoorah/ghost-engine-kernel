# PR plan (recommended split)

Keep slices separated if you want clean review/rollback.

---

## PR 1 — Slice 1: API + pipeline + stub plugin

Changes:
- Orchestrator:
  - `GET /jobs`
  - OpenAPI docs endpoint
- Worker:
  - step registry + timing
  - plugin interface + default `stub`
  - result includes `sceneGraph` + `asciiMinimap`

Notes:
- Data can be in-memory for `/jobs` if you don’t have persistence yet.
- Keep result payload small.

---

## PR 2 — Slice 2: persistence (DynamoDB + S3)

Changes:
- Terraform:
  - DynamoDB table + GSI
  - S3 bucket + lifecycle
  - IAM updates for ECS task roles
- Orchestrator:
  - write initial job record on submit
  - `/status` + `/jobs` read from DynamoDB
- Worker:
  - update job record per step
  - upload artifacts to S3
  - update record with S3 keys/URLs

Rollout:
- Deploy infrastructure first
- Deploy app changes next
- Validate with acceptance tests
