# Observability: metrics + dashboard + alarms

## Option 1 (recommended quick win): CloudWatch Embedded Metric Format (EMF)
Log JSON objects that CloudWatch extracts into metrics automatically.

### Example EMF log (job complete)
```json
{
  "_aws": {
    "Timestamp": 1766685600000,
    "CloudWatchMetrics": [{
      "Namespace": "GhostEngine",
      "Dimensions": [["env","service"]],
      "Metrics": [
        {"Name":"job_duration_ms","Unit":"Milliseconds"},
        {"Name":"jobs_failed_count","Unit":"Count"}
      ]
    }]
  },
  "env": "dev",
  "service": "orchestrator",
  "job_duration_ms": 1842,
  "jobs_failed_count": 0
}
```

### Example EMF log (step complete)
```json
{
  "_aws": {
    "Timestamp": 1766685600000,
    "CloudWatchMetrics": [{
      "Namespace": "GhostEngine",
      "Dimensions": [["env","service","stepName"]],
      "Metrics": [
        {"Name":"step_duration_ms","Unit":"Milliseconds"}
      ]
    }]
  },
  "env":"dev",
  "service":"worker",
  "stepName":"compose_scene_graph",
  "step_duration_ms": 300
}
```

## Dashboard widgets
Add widgets for:
- Avg `job_duration_ms` (p50/p90 if you like)
- `jobs_failed_count` sum per 5m
- Avg `step_duration_ms` by `stepName` (optional but awesome)

## Alarms (Terraform guidance)
Create at least:
1) **Failure spike**: `jobs_failed_count` >= 1 for 1–3 datapoints over 5–15 minutes
2) **No successes** (optional): derived metric or log filter metric

If you don’t want EMF yet:
- Create a CloudWatch Logs Metric Filter on structured logs (`status":"failed"`)
- Create an alarm on that metric

