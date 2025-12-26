# Terraform Changes (SSM token, TTL, S3 lifecycle, optional SG tightening)

## 1) SSM Parameter for internal token
Create an SSM parameter (SecureString recommended):
- name: `/ghost-engine/<env>/internal_token`
- value: generated token (either manually once, or via terraform using random_password)

### Example
```hcl
resource "random_password" "internal_token" {
  length  = 32
  special = true
}

resource "aws_ssm_parameter" "internal_token" {
  name  = "/ghost-engine/${var.env}/internal_token"
  type  = "SecureString"
  value = random_password.internal_token.result
}
```

Inject into ECS task definitions as env var `INTERNAL_TOKEN` for:
- Orchestrator (to validate callbacks)
- Worker (to send callback header)

Ensure task roles can read the parameter:
```hcl
data "aws_iam_policy_document" "ssm_read" {
  statement {
    actions   = ["ssm:GetParameter", "ssm:GetParameters"]
    resources = [aws_ssm_parameter.internal_token.arn]
  }
}
```

## 2) DynamoDB TTL
Enable TTL on the Jobs table (attribute name `ttl`):
```hcl
resource "aws_dynamodb_table" "jobs" {
  # ...
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}
```

Application must write `ttl` as Unix epoch seconds.

## 3) S3 lifecycle expiration
Expire artifacts after N days (suggest 14) under a prefix (e.g. `jobs/`):

```hcl
resource "aws_s3_bucket_lifecycle_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    id     = "expire-artifacts"
    status = "Enabled"

    filter { prefix = "jobs/" }

    expiration { days = var.artifact_retention_days }
  }
}
```

## 4) Security group tightening (optional)
If possible, restrict callback traffic:
- allow inbound to Orchestrator from Worker SG only (port used for callbacks)
- OR isolate internal routes behind an internal ALB/listener

If you cannot isolate:
- token auth is mandatory
- consider rate limits/WAF later
