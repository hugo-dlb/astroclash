resource "aws_cloudwatch_log_group" "main" {
    name              = "/astroclash/api"
    retention_in_days = 7
    lifecycle {
        prevent_destroy = false
    }
}


locals {
    connection_string = "postgresql://postgres:${aws_secretsmanager_secret_version.rds_password.secret_string}@${aws_db_instance.postgres.endpoint}/astroclash"
}

resource "aws_ecs_task_definition" "backend_task" {
    family = "backend_app_family"

    // Fargate is a type of ECS that requires awsvpc network_mode
    requires_compatibilities = ["FARGATE"]
    network_mode = "awsvpc"

    // Valid sizes are shown here: https://aws.amazon.com/fargate/pricing/
    memory = "512"
    cpu = "256"

    // Fargate requires task definitions to have an execution role ARN to support ECR images
    execution_role_arn = "${aws_iam_role.ecs_role.arn}"

    container_definitions = <<EOT
    [
        {
            "name": "app_container",
            "image": "050908749326.dkr.ecr.eu-west-1.amazonaws.com/ecr_repo:latest",
            "memory": 512,
            "essential": true,
            "portMappings": [
                {
                    "containerPort": 8000,
                    "hostPort": 8000
                }
            ],
            "environment": ${jsonencode([
                {
                "name": "DATABASE_URL",
                "value": local.connection_string
                },
                {
                "name": "CORS_ALLOWED_ORIGINS",
                "value": "https://astroclash.io"
                },
                {
                "name": "PORT",
                "value": "8000"
                },
                {
                "name": "SESSION_SECRET",
                "value": "secret"
                },
                {
                "name": "NODE_ENV",
                "value": "development"
                }
            ])},
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-region": "${var.aws_region}",
                    "awslogs-stream-prefix": "astroclash",
                    "awslogs-group": "${aws_cloudwatch_log_group.main.name}"
                }
            }
        }
    ]
    EOT
}

resource "aws_ecs_cluster" "backend_cluster" {
    name = "backend_cluster_app"
}

resource "aws_security_group" "app_sg" {
    name = "app_sg"
    description = "Allow TLS inbound traffic on port 80 (http)"
    vpc_id = "${aws_vpc.vpc_app.id}"

    ingress {
        from_port = 80
        to_port = 8000
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_ecs_service" "backend_service" {
    name = "backend_service"

    cluster = "${aws_ecs_cluster.backend_cluster.id}"
    task_definition = "${aws_ecs_task_definition.backend_task.arn}"

    launch_type = "FARGATE"
    desired_count = 1

    network_configuration {
        subnets = ["${aws_subnet.private_a.id}", "${aws_subnet.private_b.id}"]
        security_groups = ["${aws_security_group.app_sg.id}"]
    }

    load_balancer {
        target_group_arn = "${aws_alb_target_group.main.id}"
        container_name   = "app_container"
        container_port   = 8000
    }
}