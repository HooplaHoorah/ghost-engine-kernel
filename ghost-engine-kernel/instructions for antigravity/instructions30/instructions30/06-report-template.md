# instructions30 — Fix Report

**Date:** 2025-12-26
**ALB:** http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com
**Region:** us-east-1

## 1) Before (failure evidence)
- /healthz snippet (show DDB/S3 fields):
```json
PASTE
```
- /generate-scene response (show 500):
```
PASTE
```

## 2) What changed
- Terraform files/modules touched:
- Values set:
  - JOBS_TABLE_NAME = ...
  - ARTIFACTS_BUCKET = ...
- terraform apply run? (Y/N)
- force-new-deployment used? (Y/N)

## 3) After (success evidence)
- /healthz snippet (DDB/S3 healthy):
```json
PASTE
```
- /generate-scene JSON (jobId):
```json
PASTE
```
- /status/<jobId> terminal:
```json
PASTE
```
- /artifact/<jobId>/levelSpec (first 30 lines):
```json
PASTE
```

## 4) Share links
- Demo: http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/demo?jobId=<jobId>
- Play: http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/play?job=<jobId>

## 5) Notes / issues
- Remaining errors:
- CloudWatch log pointers:
