resource "aws_dynamodb_table" "jobs" {
  name           = "${var.project_name}-jobs-${var.env}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "jobId"

  attribute {
    name = "jobId"
    type = "S"
  }

  attribute {
    name = "gsi1pk"
    type = "S"
  }

  attribute {
    name = "gsi1sk"
    type = "S"
  }

  global_secondary_index {
    name               = "gsi1"
    hash_key           = "gsi1pk"
    range_key          = "gsi1sk"
    projection_type    = "ALL"
  }

  tags = {
    Environment = var.env
    Project     = var.project_name
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}
