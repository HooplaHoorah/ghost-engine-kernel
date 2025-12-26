resource "aws_s3_bucket" "artifacts" {
  bucket = "${var.project_name}-artifacts-${var.env}"
}

resource "aws_s3_bucket_public_access_block" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    id     = "expire-old-artifacts"
    status = "Enabled"
    filter {
      prefix = "jobs/"
    }
    expiration {
      days = 30
    }
  }
}
