# Ghost Engine — instructions14
## Slice 9: Smoke Artifact URL Validation + Warmup Script + Demo “Presentation Mode”

Slice 8 delivered:
- `ge-fetch --launch` (auto-launch runtime)
- `prompt-play` one-liner
- `/healthz` rich diagnostics
- determinism regression CI
- smoke-test prints /healthz preflight + on failure

Slice 9 focuses on catching the most common demo-breakers **before** they reach the stage:
1) presigned artifact URLs broken/expired/permissioned incorrectly
2) “cold start” or partial dependency readiness
3) not having a single warmup command for presenters

### Outcomes
- Smoke test validates **artifact URLs** (S3 presigned links) when present.
- A `warmup` command runs health checks + a sample job and prints a share link.
- Demo can run in “presentation mode” with predictable prompts and fast success paths.

### Contents
- `SLICE9_PLAN.md`
- `SMOKE_ARTIFACT_URL_VALIDATION.md`
- `WARMUP_SCRIPT.md`
- `PRESENTATION_MODE.md`
- `CHECKLIST.md`
- `templates/` (code snippets)

