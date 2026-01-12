# Checklist — Definition of Done (Slice 9 / instructions14)

## Smoke artifact URL validation
- [ ] `scripts/smoke.mjs` fetches and validates presigned URLs when present
- [ ] JSON artifacts parse successfully
- [ ] Text artifacts are non-empty
- [ ] Failures print actionable diagnostics
- [ ] Inline fallback checks still pass in demo mode

## Warmup script
- [ ] `scripts/warmup.js` added
- [ ] prints `/healthz` payload
- [ ] generates doom-bridge job with fixed seed
- [ ] polls to done and prints share link
- [ ] optionally validates artifact URLs

## Presentation mode (optional)
- [ ] add 3–5 stage-safe preset prompts (and suggested seeds)
- [ ] (optional) add “Run Warmup” button to /demo

