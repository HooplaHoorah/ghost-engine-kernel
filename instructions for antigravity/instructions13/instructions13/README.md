# Ghost Engine — instructions13
## Slice 8: One-Command Prompt→Play + Auto-Launch Finish + Determinism CI + Healthz

You now have a working GE Doom runtime loader (`node ge-doom/runtime.js --levelSpec <path>`).
Slice 8 makes the end-to-end demo **frictionless** and **stage-proof**:

### Outcomes
1) `ge-fetch --launch` actually launches GE Doom runtime after saving LevelSpec.
2) A single command `prompt-play` performs: **generate → poll → fetch → launch**.
3) Determinism regression test runs automatically (CI / nightly) and is easy to run locally.
4) Orchestrator exposes `/healthz` for stage checks and tooling.

### Contents
- `SLICE8_PLAN.md`
- `GE_FETCH_LAUNCH.md`
- `PROMPT_PLAY_WRAPPER.md`
- `DETERMINISM_CI.md`
- `HEALTHZ.md`
- `CHECKLIST.md`
- `templates/` (drop-in code skeletons)
