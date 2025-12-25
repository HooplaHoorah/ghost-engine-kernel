resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-dashboard-${var.env}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", var.orchestrator_service_name, "ClusterName", var.cluster_name],
            ["AWS/ECS", "CPUUtilization", "ServiceName", var.worker_service_name, "ClusterName", var.cluster_name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "ECS CPU Utilization"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ECS", "MemoryUtilization", "ServiceName", var.orchestrator_service_name, "ClusterName", var.cluster_name],
            ["AWS/ECS", "MemoryUtilization", "ServiceName", var.worker_service_name, "ClusterName", var.cluster_name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "ECS Memory Utilization"
        }
      },
      {
         type = "log"
         x = 0
         y = 6
         width = 24
         height = 6
         properties = {
            query = "SOURCE '/ecs/${var.project_name}-orchestrator-${var.env}' | fields @timestamp, @message\n| sort @timestamp desc\n| limit 20"
            region = var.aws_region
            title = "Orchestrator Logs"
            view = "table"
         }
      }
    ]
  })
}
