output "cluster_name" { value = aws_ecs_cluster.main.name }
output "orchestrator_service_name" { value = aws_ecs_service.orchestrator.name }
output "worker_service_name" { value = aws_ecs_service.worker.name }
