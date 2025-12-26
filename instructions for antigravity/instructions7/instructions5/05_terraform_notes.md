# Terraform notes (AWS ECS + DynamoDB + S3)

This is a checklist-style guide. Translate it to your existing Terraform layout.

---

## 1) DynamoDB jobs table

- Resource: `aws_dynamodb_table.ghost_engine_jobs`
- Billing: on-demand (PAY_PER_REQUEST) for simplicity
- Hash key: `jobId` (S)
- Attributes:
  - `jobId` (S)
  - `gsi1pk` (S)
  - `gsi1sk` (S)
  - optional `ttlEpochSeconds` (N) — enable TTL

### GSI1

- name: `gsi1`
- partition key: `gsi1pk` (S) — set to constant `"JOB"`
- sort key: `gsi1sk` (S) — set to `"2025-12-25T...Z#<jobId>"` (or epoch)

Query newest:
- `KeyConditionExpression: gsi1pk = :JOB`
- `ScanIndexForward = false`
- `Limit = 20`

---

## 2) S3 artifacts bucket

- Resource: `aws_s3_bucket.ghost_engine_artifacts`
- Block public access: ON
- Encryption: SSE-S3 or SSE-KMS (either is fine)
- Lifecycle:
  - Expire `jobs/` objects after N days

---

## 3) IAM policies for ECS task roles

### Orchestrator task role needs

- `dynamodb:GetItem`
- `dynamodb:PutItem`
- `dynamodb:UpdateItem`
- `dynamodb:Query`

Resources:
- table ARN
- index ARN (`.../index/gsi1`)

### Worker task role needs

Same DynamoDB perms as above plus:

- `s3:PutObject`
- `s3:GetObject`

Resource:
- `arn:aws:s3:::<bucket-name>/jobs/*`

---

## 4) Environment variables

Add to both services:

- `JOBS_TABLE_NAME=ghost-engine-jobs-<env>`
- `ARTIFACTS_BUCKET=ghost-engine-artifacts-<env>` (worker at minimum)
- `ENGINE_PLUGIN=stub`

---

## 5) Optional: CloudWatch dashboard updates

If you maintain a dashboard:
- add widget for DynamoDB throttles/latency
- add widget for S3 4xx/5xx (if using request metrics)
