# Slice 6 Plan — “Prompt → Play”

## A) Freeze the LevelSpec contract
- Confirm `levelSpec.version` (recommend: `"0"` for now)
- Add a JSON Schema file for v0
- Add validation on:
  - Worker plugin output (ensure it conforms before storing)
  - GE Doom loader (validate before building geometry)

## B) Implement GE Doom LevelSpec Loader
Implement a loader module that:
1) loads JSON (local file or URL)
2) validates
3) builds geometry + entities
4) boots the level

## C) One-button workflow
Pick one:
- **CLI fetcher**: `ge-fetch <jobId>` downloads `levelSpec.json` and launches GE Doom with it
- **Watched folder**: game watches `Levels/incoming/` and auto-loads newest spec
- **In-game URL**: paste `levelSpecUrl` inside the game UI and load

CLI fetcher is fastest and demo-friendly.

## D) Minimum playable feature set
- rooms/walls
- at least 1 locked door requiring key
- spawn point
- exit trigger
- at least 1 enemy (simple AI or static is ok)

## E) Determinism check
- same job replay yields same LevelSpec hash
- GE Doom renders same layout given same LevelSpec

