# GE Doom Ingestion — Minimum Playable (“Prompt → Play”)

## Goal
Load `levelSpec.json` produced by `doom-bridge` and generate a minimal playable level in the GE Doom build.

This is not a full Doom format exporter yet; it’s a **bridge** that proves the end-to-end loop.

## Inputs
- `levelSpec.json` (from presigned URL or local file)
- Tiles: `tiles.size` (default 64) and `rooms[]` rectangles

## Recommended approach
### 1) Implement a LevelSpecLoader module
Responsibilities:
- parse JSON
- validate `version`, `rooms`, `connections`, `entities`, `spawn`, `exit`
- build an in-memory grid (tile occupancy)

### 2) Build geometry (blocky but reliable)
Option A (fast): grid-based walls
- For each room rectangle, carve floor area
- Surround floor with walls (solid)
- For each connection/door between rooms:
  - cut a doorway opening on the shared wall or nearest wall segment

### 3) Place entities
- spawn: player start
- exit: goal trigger
- key: pickup; store keyId in inventory
- locked door: requires keyId to open
- enemy: map subtype to a prefab (start with 1 enemy type)

### 4) Navigation and testing
- Ensure player can reach key and then exit
- Ensure doors have collision and can open
- Ensure enemy spawns and can be killed or avoided

## Minimal mapping rules
- room coordinates are in tile units (x,y,w,h)
- world units = tile * tiles.size
- Use deterministic placements from LevelSpec; do not randomize

## Acceptance criteria
- Given a LevelSpec from `/status/:id`, GE Doom loads it and you can:
  - move around rooms
  - open at least one door
  - pick up key
  - unlock door
  - reach exit and trigger “level complete”
- Demo story: “type prompt → generate → click levelSpec → load in game → play.”
