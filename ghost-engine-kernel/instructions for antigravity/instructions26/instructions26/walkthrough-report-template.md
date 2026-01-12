# Demo Walkthrough Report (instructions26)

## Environment
- Local base URL: http://localhost:8080
- Worker URL (expected): http://localhost:8081
- Branch:
- Commit hash:
- OS:

## Preflight outputs
- `curl -s http://localhost:8080/healthz`
```json
PASTE HERE
```

- `/docs` or `/openapi.json` load result:
  - (notes)

- Readiness report (if present):
  - `API_BASE_URL=http://localhost:8080 node scripts/demo-readiness-report.js --determinism --md`
```md
PASTE HERE
```

## Browser walkthrough (/demo)
### Run 1 (Doom preset)
- Prompt / preset:
- Plugin:
- Seed:
- Job id:
- Time to complete:
- Artifact links worked? (Y/N)
- Notes:

### Run 2 (same seed determinism)
- Seed:
- Job id:
- Hash of LevelSpec run1:
- Hash of LevelSpec run2:
- Byte-identical? (Y/N)

### Run 3 (different seed variation)
- Seed:
- Job id:
- Variation observed (what changed?):

## UI issues (if any)
- Replay button:
- Warmup button:
- Play button:
- Any console errors:

## Fail tests
- What did you try that failed?
- HTTP status codes:
- Error message(s):
- traceId(s) / log pointers:

## Stage readiness verdict
- What felt solid?
- What felt risky?
- Top 3 fixes you recommend next:
