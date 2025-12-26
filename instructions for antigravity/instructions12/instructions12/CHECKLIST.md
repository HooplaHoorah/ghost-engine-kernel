# Checklist — Definition of Done (Slice 7 / instructions12)

## GE Doom runtime loader
- [ ] Game accepts `--levelSpec <path>` (or equivalent)
- [ ] Loads and validates LevelSpec v0
- [ ] Builds rooms/walls/doors
- [ ] Key pickup + locked door logic works
- [ ] Enemy spawns (at least 1 type)
- [ ] Exit trigger ends level with clear message
- [ ] Friendly error handling on invalid spec (no crash)

## Auto-launch / auto-reload
- [ ] `ge-fetch --launch` launches the game into the level
- [ ] (Optional) watched folder auto-reloads newest LevelSpec

## Determinism tests
- [ ] Backend script verifies replay LevelSpec hash equality
- [ ] Game computes and logs grid hash; identical specs yield identical hash

## Stage hardening
- [ ] `/healthz` exists and returns useful JSON
- [ ] Warm-up checklist documented and repeatable
- [ ] Backup job links prepared (or script to generate quickly)
- [ ] Offline fallback LevelSpecs available
