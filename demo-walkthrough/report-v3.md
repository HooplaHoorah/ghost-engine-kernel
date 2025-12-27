# Demo Walkthrough Report v3 — instructions32

**Date:** 2025-12-27
**CloudFront Base:** https://d3a3b2mntnsxvl.cloudfront.net
**Origin ALB:** http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com
**Branch/Commit:** 3e2279eaeb64f8303736f6c46a6ccd7b24d608b57

## 1) Observability
- Log groups:
  - orchestrator: `/ecs/ghost-engine-orchestrator-dev` (retention: 7 days)
  - worker: `/ecs/ghost-engine-worker-dev` (retention: 7 days)
- Dashboard: `ghost-engine-dashboard-dev`
```json
{
    "DashboardArn": "arn:aws:cloudwatch::837801696495:dashboard/ghost-engine-dashboard-dev",
    "DashboardBody": "{\"widgets\":[{\"height\":6,\"properties\":{\"metrics\":[[\"AWS/ECS\",\"CPUUtilization\",\"ServiceName\",\"orchestrator\",\"ClusterName\",\"ghost-engine-cluster-dev\"],[\"AWS/ECS\",\"CPUUtilization\",\"ServiceName\",\"worker\",\"ClusterName\",\"ghost-engine-cluster-dev\"]],\"region\":\"us-east-1\",\"stacked\":false,\"title\":\"ECS CPU Utilization\",\"view\":\"timeSeries\"},\"type\":\"metric\",\"width\":12,\"x\":0,\"y\":0},{\"height\":6,\"properties\":{\"metrics\":[[\"AWS/ECS\",\"MemoryUtilization\",\"ServiceName\",\"orchestrator\",\"ClusterName\",\"ghost-engine-cluster-dev\"],[\"AWS/ECS\",\"MemoryUtilization\",\"ServiceName\",\"worker\",\"ClusterName\",\"ghost-engine-cluster-dev\"]],\"region\":\"us-east-1\",\"stacked\":false,\"title\":\"ECS Memory Utilization\",\"view\":\"timeSeries\"},\"type\":\"metric\",\"width\":12,\"x\":12,\"y\":0},{\"height\":6,\"properties\":{\"query\":\"SOURCE '/ecs/ghost-engine-orchestrator-dev' | fields @timestamp, @message\\n| sort @timestamp desc\\n| limit 20\",\"region\":\"us-east-1\",\"title\":\"Orchestrator Logs\",\"view\":\"table\"},\"type\":\"log\",\"width\":24,\"x\":0,\"y\":6}]}",
    "DashboardName": "ghost-engine-dashboard-dev"
}
```
- Alarms:
  - `ghost-engine-alb-5xx-dev` (state: OK)
  - `ghost-engine-orch-high-cpu-dev` (state: OK)
  - `ghost-engine-orch-tasks-low-dev` (state: INSUFFICIENT_DATA - *Note: Implemented as High CPU check, waiting for data/usage*)

## 2) Zero-click Play
- Test jobId: `ed0f66d4-16cb-49ec-a05e-2d25e3d86a1f`
- Play URL: https://d3a3b2mntnsxvl.cloudfront.net/play?job=ed0f66d4-16cb-49ec-a05e-2d25e3d86a1f
- Result: loads without manual proxy click? Y
- Notes: The `play.js` logic now attempts a direct fetch and automatically falls back to `/artifact/:jobId/levelSpec` on error (e.g. CORS), masking the failure from the user and just working.

## 3) Demo Pack
- Command:
```bash
node scripts/demo-pack.mjs
```
- Output snippet:
```
# Ghost Engine Demo Pack
Base: https://d3a3b2mntnsxvl.cloudfront.net

healthz: {"ok":true,"time":"2025-12-27T07:12:47.382Z","configured":{"JOBS_TABLE_NAME":true,"ARTIFACTS_BUCKET":true,"INTERNAL_TOKEN":true},"checks":{"ddb":true,"s3":true}}
jobId: 7a0a96c8-fa1d-46cf-a6ee-4498d4058d55
status: {"createdAt":"2025-12-27T07:12:47.935Z","error":null,"gsi1pk":"JOB","gsi1sk":"2025-12-27T07:12:47.935Z#7a0a96c8-fa1d-46cf-a6ee-4498d4058d55","input":{"seed":20448,"plugin":"doom-bridge","prompt":"doom-bridge: tiny test dungeon with a key and locked exit"},"jobId":"7a0a96c8-fa1d-46cf-a6ee-4498d4058d55","plugin":"doom-bridge","progress":1,"promptPreview":"doom-bridge: tiny test dungeon with a key and locked exit","result":{"sceneGraphS3Key":"jobs/7a0a96c8-fa1d-46cf-a6ee-4498d4058d55/sceneGraph.json","pluginVersion":"0.1.0","levelPreviewAsciiS3Key":"jobs/7a0a96c8-fa1d-46cf-a6ee-4498d4058d55/levelPreviewAscii.txt","levelSpecS3Key":"jobs/7a0a96c8-fa1d-46cf-a6ee-4498d4058d55/levelSpec.json","asciiMinimapS3Key":"jobs/7a0a96c8-fa1d-46cf-a6ee-4498d4058d55/asciiMinimap.txt","sceneGraphUrl":"...","asciiMinimapUrl":"...","levelSpecUrl":"...","levelPreviewAsciiUrl":"..."},"state":"done","steps":[],"ttl":1768029167,"updatedAt":"2025-12-27T07:13:02.131Z"}
levelSpec ok: true

## Share Links
Demo: https://d3a3b2mntnsxvl.cloudfront.net/demo?jobId=7a0a96c8-fa1d-46cf-a6ee-4498d4058d55
Play: https://d3a3b2mntnsxvl.cloudfront.net/play?job=7a0a96c8-fa1d-46cf-a6ee-4498d4058d55
```
- Backup Play links:
  - https://d3a3b2mntnsxvl.cloudfront.net/play?job=ed0f66d4-16cb-49ec-a05e-2d25e3d86a1f
  - https://d3a3b2mntnsxvl.cloudfront.net/play?job=7a0a96c8-fa1d-46cf-a6ee-4498d4058d55

## 4) Issues / follow-ups
- The "Tasks Low" alarm is currently implemented as a High CPU check due to Terraform metrics constraints without Container Insights.
- Zero-click play is verified and functional.
