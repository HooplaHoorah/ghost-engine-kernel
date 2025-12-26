# Checklist — Definition of Done (Slice 6 / instructions11)

## Contract
- [ ] `levelSpec.version` frozen (v0) and documented
- [ ] JSON Schema added to repo
- [ ] Worker validates LevelSpec before storing (or at least unit tests validate output)
- [ ] GE Doom validates before building level

## GE Doom Loader
- [ ] Loads from local path
- [ ] (Optional) Loads from URL
- [ ] Builds room geometry (walls/floor)
- [ ] Carves door openings
- [ ] Spawns player at spawn
- [ ] Places exit trigger and detects completion
- [ ] Spawns at least 1 enemy

## Gameplay loop
- [ ] Key pickup works
- [ ] Locked door requires key
- [ ] Exit triggers win

## One-button workflow
- [ ] `ge-fetch <jobId>` downloads LevelSpec and launches GE Doom (or saves into watched folder)
- [ ] Clear console output and failure states

## Determinism
- [ ] Replay yields identical LevelSpec hash
- [ ] Same LevelSpec yields identical play layout

