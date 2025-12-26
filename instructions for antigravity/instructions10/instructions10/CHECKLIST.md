# Checklist — Definition of Done (Slice 5 / instructions10)

## Live Validation
- [ ] `/demo` works on live ALB (stub + doom-bridge)
- [ ] Presigned URLs fetch valid content (sceneGraph, minimap, levelSpec)
- [ ] CloudWatch metrics appear and dashboard shows job duration + failures
- [ ] CI smoke gate runs post-deploy and is green on healthy deploy

## GE Doom Ingestion (Playable Loop)
- [ ] GE Doom can load `levelSpec.json`
- [ ] Geometry builds (rooms/walls/doors) and is navigable
- [ ] Spawn, exit, key, locked door logic works
- [ ] At least 1 enemy type spawns
- [ ] “Prompt → generate → load in game → play” demo is repeatable

## Replay + Versioning
- [ ] Seed is always stored and returned everywhere
- [ ] pluginVersion stored and returned
- [ ] replay endpoint exists and reproduces semantic LevelSpec
- [ ] (Optional) resultHash stored and matches on replay

## Demo UI Polish
- [ ] Preset prompts exist
- [ ] `/demo?jobId=` loads and renders finished job
- [ ] Copy/download buttons for JSON exist
- [ ] seed/pluginVersion displayed
- [ ] Errors are shown clearly

## Guardrails
- [ ] Rate limit on `/generate-scene`
- [ ] Concurrency cap on running jobs
- [ ] Payload validation + limits
- [ ] Friendly 429/503 responses
