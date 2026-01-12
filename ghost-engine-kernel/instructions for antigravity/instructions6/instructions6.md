# instructions6.md — Next build steps after kernel is live (AWS ECS + ALB)

## Current status (confirmed)
- ALB health endpoint returns `{"ok":true}`:
  `http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/healthz`
- Orchestrator + Worker services are deployed on ECS.
- The initial CI “Build and Push” is fixed; images are in ECR.
- A manual “Force new deployment” was used to pull fresh images.

## Goal
Execute the next 4 initiatives **sequentially**, keeping each step shippable:

1) Prove the kernel with a real end-to-end job
2) Add persistence with DynamoDB (survive restarts / scale)
3) Add practical observability (logs + metrics)
4) Enable true CI/CD auto-deploy (no manual redeploy)

Follow the “Done means Done” checks at the end of each step before moving on.

---

# 1) Prove the kernel end-to-end with one real job (minimal viable workflow)

## Desired API contract
### POST /generate-scene
Request (example):
```json
{ "prompt": "a spooky hallway", "seed": 123, "style": "doom" }
```
Response:
```json
{ "jobId": "uuid", "statusUrl": "/status/uuid" }
```

### GET /status/:id
Response (state machine):
- `queued` -> `running` -> `done` | `failed`

Example:
```json
{
  "jobId": "uuid",
  "state": "running",
  "progress": 0.35,
  "result": null,
  "error": null
}
```

## Implementation approach (Step 1A: in-memory state)
- Orchestrator keeps an in-memory map: `jobs[jobId] = { state, progress, result, error }`
- On `POST /generate-scene`, create job, set `queued`, dispatch to Worker, set `running`
- Worker simulates real work and returns result (orchestrator updates state to `done`)

## Required changes (high level)
### Orchestrator service
- Ensure `POST /generate-scene`:
  - generates `jobId`
  - initializes state in memory
  - calls Worker `/process` with `{ jobId, payload }`
  - returns `{ jobId, statusUrl }`
- Ensure `GET /status/:id` reads from memory map and returns state.
- Add request IDs + jobId to logs.

### Worker service
- Ensure `POST /process`:
  - accepts `{ jobId, payload }`
  - does deterministic “work” based on payload (e.g., sleep + compute)
  - returns `{ jobId, ok: true, output: {...}, progressLog: [...] }`

> Keep it simple: you are proving the plumbing, not generating real scenes yet.

## Smoke test (local + deployed)
Add/update `scripts/smoke-test.sh` / `.ps1` to:
1. POST /generate-scene
2. Poll /status/:id until `done`
3. Print result

## Done means Done (Step 1)
- ALB endpoint accepts `POST /generate-scene` and returns a jobId.
- `GET /status/:id` reflects real transitions to done.
- Smoke test passes against deployed ALB URL.

---

# 2) Add persistence with DynamoDB (job state survives restarts)

## Why
In-memory state disappears on:
- task restart
- deployment
- scaling

DynamoDB makes the kernel “real” for demos + production.

## Data model
Create table: `ghost-engine-jobs-dev` (name can be variable-driven)
- Partition key: `jobId` (String)
- Attributes:
  - `state` (String)
  - `progress` (Number)
  - `result` (String / JSON string)
  - `error` (String)
  - `createdAt`, `updatedAt` (String ISO)
  - `ttl` (Number) (optional)

## Terraform tasks
- Add a `dynamodb` module or resource in `infra/aws/terraform`
- Create the table
- Output the table name
- Add IAM permissions to the ECS task role(s):
  - `dynamodb:GetItem`, `PutItem`, `UpdateItem` on the table

## App tasks
- Add env var to orchestrator:
  - `JOBS_TABLE_NAME=ghost-engine-jobs-dev`
- Update orchestrator to read/write state from DynamoDB.
- Optionally allow Worker to write progress updates directly (phase 2B).

## Done means Done (Step 2)
- If orchestrator task is restarted, previously created job states remain queryable.
- Smoke test still passes.
- DynamoDB contains job rows for last test run.

---

# 3) Observability that helps debugging (CloudWatch logs + minimal metrics)

## Logging (must-have)
- Ensure both services log JSON lines with:
  - timestamp
  - level
  - service (orchestrator/worker)
  - requestId (from ALB header if present; else generate)
  - jobId when applicable
  - message
  - error stack (when failures)

## CloudWatch Logs
- Verify logs are visible per service
- Add retention policy (e.g., 7 or 14 days) via Terraform

## Metrics (minimal, useful)
- Emit custom metrics (CloudWatch Embedded Metric Format or API):
  - `JobSucceeded` count
  - `JobFailed` count
  - `JobDurationMs` histogram-ish (log-based is ok initially)

## Alarms (optional in this step)
- ALB 5XX count > threshold
- ECS running tasks < desired tasks

## Done means Done (Step 3)
- You can open CloudWatch logs and see jobId-threaded execution.
- You can identify a failure cause from logs within 2 minutes.
- At least one metric (success/fail) is visible.

---

# 4) True CI/CD auto-deploy (build/push + deploy to ECS)

## Goal
After merging to `main`, pipeline should:
1. Build orchestrator + worker images
2. Push to ECR (tag with commit SHA + optionally `latest`)
3. Register a new ECS task definition revision with the new image tag
4. Update ECS services (`orchestrator`, `worker`) to that revision
5. Wait for services to become stable

## Approach (recommended)
- Continue using GitHub Actions OIDC role (`github-actions-role`)
- Use AWS CLI in workflow steps:
  - `aws ecs describe-task-definition`
  - `aws ecs register-task-definition`
  - `aws ecs update-service --force-new-deployment`
  - `aws ecs wait services-stable`

## Important
- Avoid relying on `latest` for deployments; prefer immutable SHA tags.
- Keep `latest` only for convenience.

## Done means Done (Step 4)
- A push to main automatically deploys new code without manual console actions.
- Health endpoint remains green after deploy.
- Workflow run ends green and includes “services-stable” wait.

---

# Execution notes for Antigravity
- Work sequentially: Step 1 -> Step 2 -> Step 3 -> Step 4
- After each step, run the smoke test against the ALB URL and verify “Done means Done”.
- Commit after each step with a clear message:
  - `feat(kernel): real job pipeline`
  - `feat(infra): dynamodb job state`
  - `chore(obs): logs and metrics`
  - `ci: auto-deploy to ecs`
- Do not add large binary artifacts to the repo.

---

# Inputs you can assume (already known)
- Region: `us-east-1`
- ALB health URL: `http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/healthz`
- ECS cluster: `ghost-engine-cluster-dev`
- Services: `orchestrator`, `worker`
- ECR repos:
  - `ghost-engine-orchestrator-dev`
  - `ghost-engine-worker-dev`
