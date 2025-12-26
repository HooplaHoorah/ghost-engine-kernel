# Replay + Versioning

## Goal
Make outputs stable, reproducible, and shareable.

## Requirements
### 1) Always persist seed
- If request omits `seed`, server generates one
- Store it in the job record and return it in:
  - `POST /generate-scene` response
  - `GET /status/:id`
  - `GET /jobs` list items

### 2) Track pluginVersion
Add `pluginVersion` to job record (string).
- Example: `"doom-bridge@0.1.0"` or a git SHA

### 3) Add replay endpoint (pick one)
Option A: `POST /jobs/:id/replay`
- Creates a new job using original prompt/plugin/seed/pluginVersion
- Returns new jobId
Option B: `POST /generate-scene` supports `{ replayJobId }`
- Ignores prompt fields and replays

### 4) Canonical JSON (for determinism checks)
If you want byte-for-byte equality:
- write JSON with stable key ordering (or store a hash)
- store `resultHash` (sha256) for `levelSpec`

## Acceptance criteria
- Replaying a job yields identical LevelSpec semantic content
- If you store resultHash, replay matches the original hash
- Demo UI can show seed + pluginVersion and provide a “Replay” button
