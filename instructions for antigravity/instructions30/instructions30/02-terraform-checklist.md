# 02 — Terraform Checklist (source of truth)

## Required env vars (minimum)
- `JOBS_TABLE_NAME`  (DynamoDB jobs table name)
- `ARTIFACTS_BUCKET` (S3 bucket for artifacts)

## Also verify (common gotchas)
- Are these env vars set for **both** services?
- Does Terraform update the ECS *service* to the newest task definition?
  - If not, use `aws ecs update-service --force-new-deployment`.
