resource "aws_dynamodb_table" "jobs" {
  name           = "${var.project_name}-jobs-${var.env}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "jobId"

  attribute {
    name = "jobId"
    type = "S"
  }

  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}
