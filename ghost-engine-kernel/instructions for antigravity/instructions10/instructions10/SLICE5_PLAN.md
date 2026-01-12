# Slice 5 Plan — “Prompt → Play” + Reliability

## A) Live validation (deployed, not local)
- Validate `/demo` on the live ALB
- Validate both plugins (`stub`, `doom-bridge`) produce artifacts with working presigned URLs
- Validate CloudWatch metrics appear and dashboard shows key signals
- Validate CI smoke gate runs and blocks regressions

## B) GE Doom ingestion (minimum playable)
- Implement a loader that takes `levelSpec.json` and builds a micro-level:
  - rooms/walls
  - doors (locked/unlocked)
  - spawn + exit
  - key + at least 1 enemy type
- The result can be “blocky” but must be navigable and demonstrate the loop

## C) Replay + versioning
- Persist and return `seed` always (even if server-generated)
- Persist and return `pluginVersion`
- Provide a replay path so demos are stable and shareable

## D) Demo polish
- “Share link” by jobId
- Preset prompt dropdown
- Copy/download buttons for LevelSpec and sceneGraph
- Show errors clearly

## E) Guardrails
- Rate limit `/generate-scene`
- Cap concurrent jobs per environment
- Validate payload sizes and sanitize inputs
