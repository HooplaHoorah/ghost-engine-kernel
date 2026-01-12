# Checklist — Definition of Done (Slice 12 / instructions17)

## demo-pack script
- [ ] `scripts/demo-pack.js` exists and runnable
- [ ] Prints `/healthz` output
- [ ] Generates 3 deterministic jobs (doom-bridge) with fixed seeds
- [ ] Polls to completion and prints 3 share links
- [ ] Validates artifact URLs if present
- [ ] Retries on 429/503 with backoff
- [ ] Exits non-zero if any job fails, but still prints successes

## Optional UI backup panel
- [ ] Panel reads from localStorage `ghost:demoPack`
- [ ] Renders clickable links
- [ ] Clear button works
- [ ] (Optional) copy button works per link

