# Checklist — Definition of Done (Slice 8 / instructions13)

## ge-fetch --launch
- [ ] `--launch` works and spawns GE Doom runtime
- [ ] requires GE_DOOM_EXEC; friendly error + exit code 2 if missing
- [ ] passes `--levelSpec <savedPath>`
- [ ] inherits stdio

## prompt-play
- [ ] supports `--prompt`, `--plugin`, `--seed`, `--launch`
- [ ] generates job and polls to done
- [ ] hands off to ge-fetch (and launch)
- [ ] prints friendly errors and exits non-zero on failure

## Determinism
- [ ] backend-determinism-test script added and runnable locally
- [ ] CI job exists (nightly + manual or main push)
- [ ] determinism failure clearly reports both hashes

## healthz
- [ ] `/healthz` exists and returns stable JSON
- [ ] includes configured flags for key env vars
- [ ] (optional) DDB/S3 pings are best-effort and time-bounded
