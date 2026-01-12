# Deployed Browser Walkthrough (ALB)

Replace:
- `<ALB_BASE>` with your live URL, e.g. `https://xxxxx.elb.amazonaws.com`

## 1) Preflight
- `curl -i <ALB_BASE>/healthz`
- `curl -i <ALB_BASE>/openapi.json | head`

Record:
- date/time
- commit hash deployed (if exposed) OR ECS task definition revision

## 2) Demo flow
1) Open: `<ALB_BASE>/demo`
2) Click **Warmup**
   - Expected: success message (or clear failure)
3) Choose preset **Doom**
4) Click **Generate**
   - Record: job id, seed, plugin
5) When complete:
   - Confirm artifact link downloads (LevelSpec)
6) Click **Replay**
   - Expected: same seed replay OR same output
7) Click **Play**
   - Copy command shown; run it locally (or in a terminal on a machine with Node)
   - Confirm runtime launches

## 3) Determinism quick check (deployed)
- Same seed replay should produce identical LevelSpec (hash match).
- Different seed should change layout/content meaningfully.

## 4) If anything fails
Record:
- HTTP status
- UI error text
- Any traceId in response/log output
- Most relevant CloudWatch log stream name (or timestamp window)
