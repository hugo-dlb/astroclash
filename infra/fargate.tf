variable "container_env_variables"{
  default = [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://postgres:postgres@host.docker.internal:5432/astroclash?schema=public"
        },
        {
          "name": "CORS_ALLOWED_ORIGINS",
          "value": "http://astroclash.io"
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
      ]
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
            "environment": ${jsonencode(var.container_env_variables)}
        }
    ]
    EOT
}

resource "aws_ecs_cluster" "backend_cluster" {
    name = "backend_cluster_app"
}

resource "aws_security_group" "security_group_app" {
    name = "security_group_app"
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
        security_groups = ["${aws_security_group.security_group_app.id}"]
    }

    load_balancer {
        # doesn't look like the right way to do it
        target_group_arn = "app_tg"
        container_name   = "app_container"
        container_port   = 8000
    }
}