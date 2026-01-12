# Integration notes

## 1) Determinism flag
- Update `scripts/demo-readiness-report.js`:
  - parse `--determinism`
  - import spawnSync from node:child_process
  - add DETERMINISM section before FINAL STATUS
- Ensure determinism failure pushes "DETERMINISM" into failed list

## 2) Artifact summary counts
- For mini smoke section:
  - track attempted/passed for that job validations
  - print summary line after checks
- For demo pack:
  - either:
    - keep a running aggregate counters across all pack jobs, or
    - print per-job + aggregate at end
  - include the aggregate summary line

