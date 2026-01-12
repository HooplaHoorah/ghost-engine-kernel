resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster-${var.env}"
}

# --- Cloud Map / Service Connect Namespace ---
resource "aws_service_discovery_private_dns_namespace" "internal" {
  name        = "ghost.local"
  description = "Ghost Engine internal service discovery"
  vpc         = var.vpc_id
}

# --- IAM Roles ---
resource "aws_iam_role" "execution_role" {
  name = "${var.project_name}-execution-role-${var.env}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "execution_role_policy" {
  role       = aws_iam_role.execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "execution_ssm_policy" {
  name = "${var.project_name}-execution-ssm-${var.env}"
  role = aws_iam_role.execution_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = ["ssm:GetParameters", "ssm:GetParameter"]
      Effect   = "Allow"
      Resource = [var.internal_token_arn]
    }]
  })
}

resource "aws_iam_role" "task_role" {
  name = "${var.project_name}-task-role-${var.env}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "task_role_policy" {
  name = "${var.project_name}-task-policy-${var.env}"
  role = aws_iam_role.task_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:DescribeTable",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ]
        Resource = [
          var.jobs_table_arn,
          "${var.jobs_table_arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = [var.artifacts_bucket_arn]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject"
        ]
        Resource = ["${var.artifacts_bucket_arn}/*"]
      }
    ]
  })
}

# --- Security Groups ---
resource "aws_security_group" "orchestrator" {
  name        = "${var.project_name}-orch-sg-${var.env}"
  description = "Orchestrator SG"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [var.alb_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "worker_to_orchestrator" {
  type                     = "ingress"
  from_port                = 8080
  to_port                  = 8080
  protocol                 = "tcp"
  security_group_id        = aws_security_group.orchestrator.id
  source_security_group_id = aws_security_group.worker.id
}

resource "aws_security_group" "worker" {
  name        = "${var.project_name}-worker-sg-${var.env}"
  description = "Worker SG"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 8081
    to_port         = 8081
    protocol        = "tcp"
    security_groups = [aws_security_group.orchestrator.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- CloudWatch Logs ---
resource "aws_cloudwatch_log_group" "orchestrator" {
  name              = "/ecs/${var.project_name}-orchestrator-${var.env}"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "worker" {
  name              = "/ecs/${var.project_name}-worker-${var.env}"
  retention_in_days = 7
}

# --- Task Definitions ---
resource "aws_ecs_task_definition" "orchestrator" {
  family                   = "${var.project_name}-orchestrator-${var.env}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.execution_role.arn
  task_role_arn            = aws_iam_role.task_role.arn

  container_definitions = jsonencode([{
    name      = "orchestrator"
    image     = "${var.ecr_orchestrator_url}:latest"
    essential = true
    portMappings = [{
      containerPort = 8080
      name          = "orchestrator-port" # Required for Service Connect
      protocol      = "tcp"
    }]
    environment = [
      { name = "PORT", value = "8080" },
      { name = "WORKER_URL", value = "http://worker:8081" },
      { name = "JOBS_TABLE_NAME", value = var.jobs_table_name },
      { name = "ARTIFACTS_BUCKET", value = var.artifacts_bucket_name },
      { name = "ENGINE_PLUGIN", value = "stub" },
      { name = "SELF_URL", value = "http://orchestrator:8080" }
    ]
    secrets = [
      { name = "INTERNAL_TOKEN", valueFrom = var.internal_token_arn }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.orchestrator.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

resource "aws_ecs_task_definition" "worker" {
  family                   = "${var.project_name}-worker-${var.env}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.execution_role.arn
  task_role_arn            = aws_iam_role.task_role.arn

  container_definitions = jsonencode([{
    name      = "worker"
    image     = "${var.ecr_worker_url}:latest"
    essential = true
    portMappings = [{
      containerPort = 8081
      name          = "worker-port"
      protocol      = "tcp"
    }]
    environment = [
      { name = "PORT", value = "8081" },
      { name = "JOBS_TABLE_NAME", value = var.jobs_table_name },
      { name = "ARTIFACTS_BUCKET", value = var.artifacts_bucket_name },
      { name = "ENGINE_PLUGIN", value = "stub" }
    ]
    secrets = [
      { name = "INTERNAL_TOKEN", valueFrom = var.internal_token_arn }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.worker.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

# --- Services ---
resource "aws_ecs_service" "orchestrator" {
  name            = "orchestrator"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.orchestrator.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [aws_security_group.orchestrator.id]
  }

  load_balancer {
    target_group_arn = var.alb_target_group_arn
    container_name   = "orchestrator"
    container_port   = 8080
  }
  
  service_connect_configuration {
    enabled = true
    namespace = aws_service_discovery_private_dns_namespace.internal.arn
    service {
      port_name = "orchestrator-port"
      discovery_name = "orchestrator"
      client_alias {
        port = 8080
        dns_name = "orchestrator"
      }
    }
  }

  lifecycle {
    ignore_changes = [task_definition]
  }
}

resource "aws_ecs_service" "worker" {
  name            = "worker"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.worker.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [aws_security_group.worker.id]
  }

  service_connect_configuration {
    enabled = true
    namespace = aws_service_discovery_private_dns_namespace.internal.arn
    service {
      port_name = "worker-port"
      discovery_name = "worker"
      client_alias {
        port = 8081
        dns_name = "worker"
      }
    }
  }

  lifecycle {
    ignore_changes = [task_definition]
  }
}
