# Checklist — Definition of Done (Slice 4 / instructions9)

## CI Gate
- [ ] Post-deploy smoke test runs in GitHub Actions after deploy
- [ ] Smoke hits live ALB and validates openapi, generate, status->done, steps, artifacts, jobs list
- [ ] Workflow fails on regression

## Demo UI
- [ ] `/demo` loads a minimal page (no build step required)
- [ ] Generate + poll works; steps render; minimap shows
- [ ] Presigned URLs are clickable; inline fallback works

## Observability
- [ ] Metrics emitted (EMF or metric filters)
- [ ] Dashboard updated with job duration + failures
- [ ] At least 2 alarms created (failure spike; optional no-success window)

## Doom Bridge Plugin
- [ ] New plugin `doom-bridge` registered
- [ ] Accepts `seed`; generates/stores seed if missing
- [ ] Produces `levelSpec` artifact and returns `levelSpecUrl` when S3 configured
- [ ] Determinism verified for identical prompt+seed
