# 05 — Data to Capture (high-signal)

Capture as much as possible *without derailing the demo*.

## Always capture
- Base URL
- Whether local or deployed
- Browser + version
- Timestamps for start/end
- jobId(s) for each run
- seed(s) for each run
- plugin name for each run
- Total runtime per job (rough)

## If something fails
- Exact URL that failed
- HTTP status code
- Full error text (copy/paste)
- Screenshot of UI state
- The job status JSON (from status endpoint, if accessible)

## Helpful extras (if you have access)
- Orchestrator logs around failure timestamp
- Worker logs around failure timestamp
- CloudWatch log group names / stream names (deployed)
- ECS service desired/running counts (deployed)

## Determinism proof
Best proof is:
- download both LevelSpec JSON files (original + replay)
- confirm identical or explain differences
- include hashes if possible:

```bash
shasum -a 256 original.json replay.json
```
