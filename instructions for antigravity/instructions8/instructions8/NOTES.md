# Notes / Implementation Tips

## Presign location
- Presign in Orchestrator unless you have a strong reason not to.
- Keep `expiresIn` short (15m) unless product needs otherwise.

## TTL + Lifecycle alignment
- Pick a single retention period and apply it consistently.
- Suggested default: 14 days. Consider 30 if you want longer history.

## Backwards compatibility
- Keep demo mode behavior identical when env vars are missing.
- When adding new fields (`sceneGraphUrl`), do not remove existing ones.

## “Done means demo”
A teammate should be able to:
1) open `/docs`
2) call generate
3) watch steps progress
4) click artifact URLs
5) see job in `/jobs`
…without reading the repo.
