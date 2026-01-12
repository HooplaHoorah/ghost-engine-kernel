# Slice 4 Plan — CI Gate + Demo UI + Observability + GE Doom Bridge

> Goal: make Ghost Engine “judge-ready” and begin the CodeLaunch bridge to GE Doom.

## A) CI Gate (post-deploy)
### Requirement
After any automated deploy, run the repo smoke test **against the deployed ALB** and fail the workflow if the system is unhealthy.

### Acceptance criteria
- Smoke job runs after deploy on main branch
- Smoke test hits:
  - `/openapi.json` (200)
  - `POST /generate-scene` (200; returns jobId)
  - `GET /status/:id` eventually returns `done` within max time
  - `steps.length >= 4`
  - artifacts present inline OR via presigned URLs
  - `/jobs` contains the job id
- Workflow fails on any of the above failures

---

## B) Demo UI (one-click)
### Requirement
A minimal web page that runs in any browser and shows:
- prompt input + (optional) seed input
- “Generate” button
- live job status + steps table
- ASCII minimap rendering
- artifact download links (presigned URLs), or inline download fallback

### Acceptance criteria
- `GET /demo` (or `/`) loads the page
- A user can complete an end-to-end generation without curl
- Works in demo mode and persistent mode

---

## C) Observability (metrics + alarms)
### Requirement
Emit and surface:
- `job_duration_ms`
- `step_duration_ms` (by stepName)
- `jobs_failed_count`

Add at least 2 alarms:
- high failure rate
- no successful jobs in N minutes (optional but great for demos)

### Acceptance criteria
- Metrics appear (CloudWatch metrics or EMF-derived)
- Dashboard has job duration + failures visible
- Alarms can notify via SNS/email (optional; at minimum alarms exist)

---

## D) GE Doom Bridge Plugin (deterministic)
### Requirement
Add a new Worker plugin that produces a Doom-friendly intermediate artifact (“LevelSpec”) from `sceneGraph`.

### Must-haves
- Deterministic output given `{ prompt, seed }`
- Outputs:
  - `levelSpec.json` (stored in S3 when configured)
  - (optional) `levelPreviewAscii` distinct from minimap

### Acceptance criteria
- Request can specify `plugin: "doom-bridge"` and optional `seed`
- `GET /status/:id` returns `result.levelSpecUrl` or inline `levelSpec`
- Running the same prompt+seed twice produces identical LevelSpec (byte-for-byte JSON canonicalization or stable field ordering)

