# Acceptance tests (Definition of Done)

Run these manually (curl) or automate via Postman/Newman or a simple script.

---

## Slice 1 acceptance

### 1) Create a job

Request:

```bash
curl -sS -X POST "$BASE_URL/generate-scene" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Haunted space station with 6 rooms, keycard doors, 2 patrol enemies",
    "plugin": "stub",
    "params": { "difficulty": "normal", "seed": 42 }
  }'
```

Expected:
- HTTP 200/202
- JSON includes `jobId`

### 2) Poll status

```bash
curl -sS "$BASE_URL/status/$JOB_ID"
```

Expected (eventually):
- `state` becomes `done`
- `steps` contains all 4 steps with `durationMs` and `summary`
- `result.sceneGraph` exists
- `result.asciiMinimap` is a non-empty multi-line string

### 3) List jobs

```bash
curl -sS "$BASE_URL/jobs"
```

Expected:
- array length <= 20 by default
- newest first
- includes the created job with state + timestamps

### 4) Docs

```bash
curl -sS "$BASE_URL/openapi.json" | head
```

Expected:
- valid JSON
- includes paths for `/generate-scene`, `/status/{jobId}`, `/jobs`

---

## Slice 2 acceptance

### 1) Persistence across restart

- Create a job
- Wait for `done`
- Restart Orchestrator + Worker tasks (or redeploy)
- Verify:
  - `GET /status/{jobId}` still returns the job
  - `GET /jobs` still lists it (at least until TTL/lifecycle)

### 2) Artifacts in S3

- Confirm S3 objects exist under `jobs/{jobId}/...`
- If returning URLs, confirm they download successfully.

### 3) DynamoDB listing

- Create 3–5 jobs
- Ensure `GET /jobs` returns newest first and is not scanning the whole table (CloudWatch metrics / logs should show `Query` on GSI).

---

## Non-functional checks

- Logs include `jobId`, `traceId` (if used), `stepName`, `durationMs`
- Errors are sanitized (no secrets, no provider keys, no full prompt if sensitive)
