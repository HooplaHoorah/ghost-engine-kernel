resource "aws_ecr_repository" "orchestrator" {
  name = "${var.project_name}-orchestrator-${var.env}"
  image_tag_mutability = "MUTABLE"
  force_delete = true
  
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "worker" {
  name = "${var.project_name}-worker-${var.env}"
  image_tag_mutability = "MUTABLE"
  force_delete = true
  
  image_scanning_configuration {
    scan_on_push = true
  }
}
