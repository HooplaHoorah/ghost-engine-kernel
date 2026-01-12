# Ghost Engine — instructions12
## Slice 7: GE Doom Runtime Loader + Auto-Launch + Determinism Tests + Stage Hardening

Slice 6 delivered the contract + deterministic gameplay semantics + CLI fetcher that saves LevelSpec.
Slice 7 makes the demo **stage-proof** by making “Play” fully real and automated.

### Outcomes
1) **GE Doom runtime loader** consumes `levelSpec.json` and builds a playable level.
2) **Auto-load / auto-launch**: one command (or file drop) opens the game on the generated level.
3) **Determinism regression test**: replay yields identical LevelSpec hash; game renders identical layout.
4) **Stage hardening**: health endpoints, warm-up, fallback flows, and clear failure UX.

### Contents
- `SLICE7_PLAN.md`
- `GE_DOOM_RUNTIME_LOADER.md`
- `AUTO_LAUNCH_AUTORELOAD.md`
- `DETERMINISM_TESTS.md`
- `STAGE_HARDENING.md`
- `CHECKLIST.md`
- `templates/` (scripts + sample pseudo-code)
