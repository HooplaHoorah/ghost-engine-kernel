# Checklist — Definition of Done (Slice 10 / instructions15)

## Presentation presets
- [ ] Demo presets include “Presentation (fast + reliable)” group
- [ ] Selecting a preset auto-fills prompt + plugin + seed
- [ ] Presets generate reliably and quickly

## Run Warmup button
- [ ] Button exists on `/demo`
- [ ] Runs deterministic doom-bridge job (seed 12345)
- [ ] Updates URL to `?jobId=` and renders results
- [ ] Disabled while running; errors shown clearly

## Warmup script polish
- [ ] Prints pluginVersion when available
- [ ] Always prints share link even on validation issues
- [ ] URL validation failures include artifact name + status + truncated URL
- [ ] Exits non-zero when validation issues occurred

