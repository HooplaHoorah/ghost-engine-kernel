output "dns_name" { value = aws_lb.main.dns_name }
output "target_group_arn" { value = aws_lb_target_group.orchestrator.arn }
output "security_group_id" { value = aws_security_group.alb.id }
output "lb_arn_suffix" { value = aws_lb.main.arn_suffix }
output "target_group_arn_suffix" { value = aws_lb_target_group.orchestrator.arn_suffix }
