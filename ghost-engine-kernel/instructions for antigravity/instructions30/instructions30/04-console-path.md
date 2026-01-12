# 04 — AWS Console Path (if using browser login)

## ECS
1) ECS → Clusters → <cluster>
2) Services → open Orchestrator service
3) Confirm Task definition revision
4) Task definition → Containers → Environment variables
   - ensure JOBS_TABLE_NAME and ARTIFACTS_BUCKET exist
5) Update service → Force new deployment

Repeat for Worker service.

## CloudWatch logs
ECS → Tasks → Logs
