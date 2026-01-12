variable "project_name" {}
variable "env" {}
variable "alb_dns_name" {
  description = "The DNS name of the ALB to use as origin"
  type        = string
}
