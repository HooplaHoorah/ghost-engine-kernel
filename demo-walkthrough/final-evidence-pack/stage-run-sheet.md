# Stage Run Sheet (1 page)

**Date:** 2025-12-27

## Primary URLs (copy/paste)
- Demo: https://d3a3b2mntnsxvl.cloudfront.net/demo
- Health: https://d3a3b2mntnsxvl.cloudfront.net/healthz
- Play landing: https://d3a3b2mntnsxvl.cloudfront.net/play

## Primary flow (the exact clicks)
1) Open Demo: `https://d3a3b2mntnsxvl.cloudfront.net/demo`
2) Click **Warmup** (confirm infra green)
3) Select preset: **Doom / doom-bridge**
4) Click **Generate**
5) When complete, click **Play (Browser)**
6) Move with WASD/Arrows for 10–15 seconds
7) Optional: click **Replay** with same seed to show determinism

## Fallback plan (if generation slow / errors)
### Backup Play links (instant)
- Backup #1: `https://d3a3b2mntnsxvl.cloudfront.net/play?job=ed0f66d4-16cb-49ec-a05e-2d25e3d86a1f`
- Backup #2: `https://d3a3b2mntnsxvl.cloudfront.net/play?job=7a0a96c8-fa1d-46cf-a6ee-4498d4058d55`

### Backup Demo links
- Backup #1: `https://d3a3b2mntnsxvl.cloudfront.net/demo?jobId=ed0f66d4-16cb-49ec-a05e-2d25e3d86a1f`
- Backup #2: `https://d3a3b2mntnsxvl.cloudfront.net/demo?jobId=7a0a96c8-fa1d-46cf-a6ee-4498d4058d55`

## “If something breaks” one-liners
- If Generate spins > 15s: open Backup #1 Play link
- If UI glitches: open Play link directly with backup job
- If 5xx alarm: refresh once, then use backup job

## Pre-stage checklist (5 min before)
- [ ] Run: `node scripts/demo-pack.mjs` (verify green)
- [ ] Open CloudWatch dashboard in another tab
- [ ] Have backup links copied into a note
