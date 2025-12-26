# Slice 7 Plan — Stage-Proof “Prompt → Play”

## A) GE Doom runtime loader (real “Play”)
- Implement loader inside GE Doom build that reads a LevelSpec file.
- Validate schema on load; show readable error if invalid.
- Build geometry + entities + logic:
  - rooms/walls
  - doors (locked/unlocked)
  - key pickup + inventory
  - exit trigger
  - at least one enemy

## B) Auto-launch / auto-reload workflow
Pick one (or both):
1) **Auto-launch**: `ge-fetch --launch <jobId>` downloads LevelSpec and launches GE Doom on it.
2) **Auto-reload**: GE Doom watches `Levels/incoming/` and auto-loads newest spec.

## C) Determinism regression tests
- Backend: replay yields equal LevelSpec hash
- Game: loading the same LevelSpec produces the same tile grid hash

## D) Stage hardening
- `/healthz` endpoint (Orchestrator) to check readiness
- “Warm-up” workflow: run one job before presenting
- “Fallback jobIds” and offline plan
