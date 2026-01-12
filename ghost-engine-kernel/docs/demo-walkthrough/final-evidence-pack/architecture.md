# Architecture (High Level)

## Core Components
- **Orchestrator (Service):** Node.js API. Handles `/generate-scene`, `/status`, and interactions with Cloud/Persistence.
- **Worker (Service):** Node.js background worker. Processes jobs, runs "doom-bridge" plugin logic, uploads artifacts.
- **Persistence:**
  - **DynamoDB:** Stores job state (`ghost-engine-jobs-dev`).
  - **S3:** Stores artifacts (`ghost-engine-artifacts-dev`): LevelSpec, SceneGraph, Preview.
- **Networking:**
  - **CloudFront:** HTTPS termination, caching disabled for APIs.
  - **ALB:** Internal/External load balancing to ECS Fargate tasks.

## Key Flows
1.  **Generate:** `POST /generate-scene` -> Orchestrator -> DynamoDB (State: pending).
2.  **Process:** Worker -> Polls/Claims Job -> Runs Plugin -> S3 (Artifacts) -> DynamoDB (State: done).
3.  **Play:** Browser -> `GET /play.js` -> `GET /status/:id` -> `GET S3 Signed URL` (or Proxy Fallback) -> Client-side Rendering.

## Determinism
- Input: `seed` + `prompt` + `plugin`.
- Output: Exact same `levelSpec.json`.
- Tested in CI/CD pipeline via `backend-determinism-test.js`.
