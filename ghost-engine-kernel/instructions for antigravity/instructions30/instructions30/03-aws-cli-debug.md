# 03 — AWS CLI Debug (most useful commands)

Set these:
```bash
export AWS_REGION=us-east-1
export CLUSTER="<cluster_name>"
export ORCH_SVC="<orchestrator_service_name>"
export WORKER_SVC="<worker_service_name>"
```

## A) Confirm which task definition revision is running
```bash
aws ecs describe-services --region "$AWS_REGION" --cluster "$CLUSTER" --services "$ORCH_SVC" "$WORKER_SVC"   --query 'services[].{serviceName:serviceName,taskDef:taskDefinition,desired:desiredCount,running:runningCount,pending:pendingCount}'   --output table
```

## B) Inspect env vars in a task definition
```bash
aws ecs describe-task-definition --region "$AWS_REGION" --task-definition "<taskDefArn>"   --query 'taskDefinition.containerDefinitions[].{name:name,env:environment}' --output json
```

Look for: JOBS_TABLE_NAME, ARTIFACTS_BUCKET.

## C) Force rollout
```bash
aws ecs update-service --region "$AWS_REGION" --cluster "$CLUSTER" --service "$ORCH_SVC" --force-new-deployment
aws ecs update-service --region "$AWS_REGION" --cluster "$CLUSTER" --service "$WORKER_SVC" --force-new-deployment
```
