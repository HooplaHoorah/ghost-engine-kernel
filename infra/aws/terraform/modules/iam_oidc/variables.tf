variable "github_repo" {
  type        = string
  description = "The repository name in format owner/repo"
}

variable "allowed_branches" {
  type        = list(string)
  default     = ["main"]
  description = "List of branches allowed to assume the role"
}

variable "ecr_resource_arns" {
  type        = list(string)
  description = "List of ECR repository ARNs that the role can push to"
}

variable "project_name" {
  type = string
  default = "ghost-engine" # Fallback if not provided, though ideally we pass it
}

variable "env" {
  type = string
  default = "dev"
}
