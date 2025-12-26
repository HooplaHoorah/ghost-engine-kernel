# Ghost Engine — instructions10
## Slice 5: Playable Loop + Live Validation + Replay/Versioning + Demo Polish + Guardrails

This bundle follows instructions9 (Slice 4). You now have:
- plugins incl. `doom-bridge` with deterministic seed
- Demo UI at `/demo`
- EMF metrics (job/step durations + failures)
- CI post-deploy smoke gate

Slice 5 focuses on turning this into a **CodeLaunch-ready playable loop** and making the demo reliable in public.

### Outcomes
1) **Live environment validated** end-to-end (demo page, artifacts, metrics, CI gate).
2) **GE Doom ingestion**: LevelSpec drives a minimal playable micro-level (“prompt → play” loop).
3) **Replay + versioning**: same prompt+seed+pluginVersion is replayable and traceable forever.
4) **Demo polish**: shareable job links, preset prompts, copy/download buttons.
5) **Guardrails**: rate limits, concurrency caps, and friendly error UX.

### Contents
- `SLICE5_PLAN.md`
- `LIVE_VALIDATION.md`
- `GE_DOOM_INGESTION.md`
- `REPLAY_VERSIONING.md`
- `DEMO_UI_POLISH.md`
- `GUARDRAILS.md`
- `CHECKLIST.md`
