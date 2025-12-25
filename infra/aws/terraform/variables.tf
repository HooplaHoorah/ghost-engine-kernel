variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "ghost-engine"
}

variable "env" {
  type    = string
  default = "dev"
}
variable "github_repo" { 
  type = string
  description = "owner/repo-name"
}
