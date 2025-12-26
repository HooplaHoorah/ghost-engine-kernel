# Slice 3 Plan — Hardening + Demo Ergonomics

## A) Artifact consumption: return URLs (not just keys)
### Requirement
When S3 offload is enabled, the API should return artifacts as **presigned GET URLs** (or provide an endpoint that streams/presigns).

### Preferred behavior
- `GET /status/:id` returns:
  - `result.sceneGraphUrl` (presigned)
  - `result.asciiMinimapUrl` (presigned)
  - (Optional) keep `sceneGraphKey` / `asciiMinimapKey` for debugging

### Acceptance criteria
- In persistent mode (`ARTIFACTS_BUCKET` set), `GET /status/:id` includes URLs that:
  - are valid HTTPS links
  - return the expected content when fetched
  - expire after a reasonable time (15–60 min)
- In demo mode (no bucket), status still returns inline `sceneGraph` and `asciiMinimap` as before.

---

## B) Secure the Worker → Orchestrator callback
### Requirement
`POST /internal/jobs/:id/step` must reject unauthenticated requests.

### Minimum solution (ship now)
- Require header: `X-INTERNAL-TOKEN: <shared secret>`
- Shared secret stored in SSM Parameter Store and injected to both services

### Acceptance criteria
- Callback without header returns 401
- Callback with wrong token returns 401
- Worker sends correct header and job step updates still work end-to-end

---

## C) DynamoDB correctness under concurrency + idempotency
### Requirement
Job and step updates must be safe when:
- callbacks arrive out of order
- retries occur
- multiple writers update the same job item

### Recommendation
Implement idempotent step updates using a `stepIds` set and atomic list append:
- Add a deterministic `stepId` to each callback event
- Store processed IDs in DynamoDB `stepIds` (String Set)
- Use `ConditionExpression` to ignore duplicates

Also prevent **status regression** (e.g., done → running).

### Acceptance criteria
- Duplicate step callbacks do not duplicate entries in `steps[]`
- Status transitions only move forward:
  - queued → running → done/failed
  - done/failed is terminal (no further updates allowed)
- Polling `GET /status/:id` always shows a coherent view (no missing/wiped steps)

---

## D) Retention / cleanup
### Requirement
Data should expire automatically:
- DynamoDB: TTL on job items
- S3: lifecycle expiration on artifacts

### Acceptance criteria
- DynamoDB TTL enabled and `ttl` attribute populated
- S3 lifecycle rule expires artifacts after N days
- N is configurable (default suggestion: 14 days)

---

## E) CI smoke test against deployed ALB
### Requirement
After deployment, run an integration test that hits the live API.

### Acceptance criteria
- Pipeline fails if:
  - generate/poll fails
  - status never reaches done within max time
  - artifacts missing
  - `/openapi.json` not reachable
- Pipeline passes on a healthy deployment

---

## F) Observability quick wins
### Requirement
Emit basic metrics for:
- job duration
- per-step duration
- errors

### Acceptance criteria
- Metrics appear in CloudWatch (or are easily queryable via Logs Insights)
- Dashboard contains at least:
  - job count by status
  - avg job duration
  - error count
