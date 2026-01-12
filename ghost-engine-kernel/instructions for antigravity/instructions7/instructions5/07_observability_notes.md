# Observability notes (optional but recommended)

You already have structured logs + a CloudWatch dashboard; this slice makes them more useful.

---

## 1) Structured logs per step

Log events like:

- `job.step.start`
- `job.step.done`
- `job.step.failed`

Fields:
- `jobId`
- `traceId` (if available)
- `stepName`
- `durationMs`
- `plugin`
- `state`

This makes it easy to filter in Logs Insights.

---

## 2) Metrics (if you want)

Emit custom metrics:
- `GhostEngine/StepDurationMs` with dimensions:
  - `Service=Worker`
  - `Step=parse_prompt|...`
  - `Plugin=stub|...`

Also track:
- `JobsDone`
- `JobsFailed`
- `JobLatencyMs` (queued->done)

---

## 3) Correlation IDs

If the Orchestrator generates `traceId`, include it in the queue message.
Worker uses same `traceId` so logs join cleanly.

---

## 4) Guardrails

- Don’t log full prompts by default; log `promptPreview`.
- Don’t log secrets or provider keys.
