# Terraform env var example (generic)

Wherever you define ECS container environment, ensure:

```hcl
environment = [
  { name = "JOBS_TABLE_NAME",  value = aws_dynamodb_table.jobs.name },
  { name = "ARTIFACTS_BUCKET", value = aws_s3_bucket.artifacts.bucket },
]
```

Make sure this exists for BOTH orchestrator and worker container definitions.
