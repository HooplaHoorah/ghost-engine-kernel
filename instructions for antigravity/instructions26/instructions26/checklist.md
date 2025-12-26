# Demo Verification Checklist

## Before demo
- [ ] Orchestrator health: /healthz returns 200
- [ ] OpenAPI docs load: /docs or /openapi.json
- [ ] Worker reachable from orchestrator (generate succeeds)

## Demo flow (browser)
- [ ] /demo loads
- [ ] Generate works (Doom preset)
- [ ] Artifacts download OK
- [ ] Share link (if present) works
- [ ] Replay works (or at least replays seed reliably)

## Determinism
- [ ] Same prompt + same seed => identical LevelSpec (hash match)
- [ ] Same prompt + different seed => variation

## Stage readiness
- [ ] No manual env var hacks required
- [ ] If anything fails, error text is visible + traceId/log pointer exists
