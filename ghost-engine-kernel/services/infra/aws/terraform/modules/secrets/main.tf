variable "project_name" { type = string }
variable "env" { type = string }

resource "random_password" "internal_token" {
  length  = 32
  special = false
}

resource "aws_ssm_parameter" "internal_token" {
  name  = "/${var.project_name}/${var.env}/internal_token"
  type  = "SecureString"
  value = random_password.internal_token.result
}

output "internal_token_arn" {
  value = aws_ssm_parameter.internal_token.arn
}

output "internal_token_name" {
    value = aws_ssm_parameter.internal_token.name
}
