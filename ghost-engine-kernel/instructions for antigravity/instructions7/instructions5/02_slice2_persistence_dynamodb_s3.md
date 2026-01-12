# Slice 2 — Persistence (DynamoDB + S3)

Goal: jobs and artifacts survive redeploys and are shareable.

---

## A) DynamoDB: Job State Table

Create a DynamoDB table to store job state.

### 1) Recommended schema (simple)

**Table:** `ghost-engine-jobs-{env}`

- Partition key: `jobId` (string)
- Attributes:
  - `state` (string)
  - `createdAt` (ISO string)
  - `updatedAt` (ISO string)
  - `plugin` (string)
  - `promptPreview` (string)
  - `steps` (list/map)
  - `resultSummary` (string) — optional
  - `resultS3Key` (string) — optional
  - `error` (map/string) — optional
  - `ttlEpochSeconds` (number) — optional (for auto-expiration)

**GSI (for listing):**
- `GSI1PK = "JOB"` (string constant)
- `GSI1SK = createdAt#jobId` (string) OR a numeric createdAt epoch
- Query `GSI1PK="JOB"` descending to list newest jobs.

This avoids a full table scan and supports “latest 20”.

### 2) Lifecycle / TTL

If you want cleanup, set `ttlEpochSeconds` at creation time (e.g., now + 7 days) and enable TTL on that attribute.

---

## B) S3: Artifact Storage

Create an S3 bucket for artifacts.

**Bucket:** `ghost-engine-artifacts-{env}`
- Default SSE (SSE-S3 is fine)
- Block public access ON
- Lifecycle rule: expire objects after 7–30 days (your choice)

### 1) Object naming

Use stable keys:

`jobs/{jobId}/sceneGraph.json`
`jobs/{jobId}/asciiMinimap.txt`
(optionally) `jobs/{jobId}/result.json`

### 2) Status response after Slice 2

Instead of embedding large JSON, store in S3 and return:

```json
"result": {
  "sceneGraphS3Key": "jobs/{jobId}/sceneGraph.json",
  "asciiMinimapS3Key": "jobs/{jobId}/asciiMinimap.txt",
  "artifactUrl": "https://..." // optional pre-signed URL
}
```

**Note:** you can keep embedding small artifacts too; S3 is mainly to ensure durability.

---

## C) Service changes

### 1) Orchestrator on submit

When `POST /generate-scene`:
- generate `jobId`
- write DynamoDB item: `state="queued"`, `createdAt`, `updatedAt`, `plugin`, `promptPreview`, empty steps
- enqueue message to worker

### 2) Worker updates

At job start:
- update DynamoDB: `state="running"`, `updatedAt`
- update step states as they run

On completion:
- write artifacts to S3
- update DynamoDB: `state="done"`, `updatedAt`, `resultS3Key(s)` + optional summary

On failure:
- update DynamoDB: `state="failed"`, `updatedAt`, `error`

### 3) API reads

- `GET /status/{jobId}` reads from DynamoDB
- `GET /jobs` queries the GSI (newest first, limit 20)

---

## D) IAM (ECS task roles)

Update the Orchestrator task role:
- `dynamodb:PutItem`, `dynamodb:UpdateItem`, `dynamodb:GetItem`, `dynamodb:Query` on the Jobs table + its GSI

Update the Worker task role:
- Same DynamoDB permissions as above
- `s3:PutObject`, `s3:GetObject` on the artifacts bucket prefix `jobs/*`
- If generating presigned URLs, it still uses `GetObject` permissions.

---

## E) Terraform checklist

See `05_terraform_notes.md` for a concrete checklist.

---

## Deliverables (Slice 2)

- [ ] DynamoDB Jobs table + GSI for listing
- [ ] S3 artifacts bucket + lifecycle policy
- [ ] IAM permissions for both services
- [ ] Orchestrator writes job record on submit
- [ ] Worker updates job record per step, writes artifacts to S3
- [ ] `/status` and `/jobs` backed by DynamoDB
