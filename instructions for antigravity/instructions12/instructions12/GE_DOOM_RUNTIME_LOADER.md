# GE Doom Runtime Loader (Implementation Spec)

## Goal
When GE Doom starts (or when user triggers “Load LevelSpec”), it loads a LevelSpec file and builds the level.

## Suggested responsibilities
### LevelSpecLoader
- Read file from disk (path passed via CLI arg `--levelSpec <path>`)
- Parse JSON
- Validate against schema (same v0 schema or equivalent)
- Produce normalized in-memory structure

### LevelBuilder
- Build tile grid from rooms + walls
- Carve door openings from connections
- Build collision meshes/brushes/tiles as your engine supports
- Spawn player at spawn
- Spawn entities (key, enemy, exit)

### Door + Key system
- Doors have `locked` and `keyId`
- Player inventory stores acquired keys
- Door interaction checks key before opening
- Key pickup destroys key entity + adds to inventory

### Exit trigger
- Create a trigger volume at exit tile
- On overlap: end level (“win”) with clear on-screen message

## Schema validation in game
Options:
- Use a JSON schema validator lib in-game (if feasible)
- Or implement a lightweight manual validator for required fields

Minimum: fail fast with friendly message and a “Back to menu” option.

## Debug overlay (recommended)
Add a toggle to show:
- jobId (optional if embedded)
- seed
- room rectangles
- door positions
- entity positions

This is extremely useful for stage Q&A.
