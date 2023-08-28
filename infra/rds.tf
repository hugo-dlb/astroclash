resource "aws_db_subnet_group" "main" {
    name = "main"
    subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
}

resource "aws_db_parameter_group" "postgres_pg" {
    name   = "postgres-pg"
    family = "postgres15"

    parameter {
        name  = "log_connections"
        value = "1"
    }

    parameter {
        name  = "rds.force_ssl"
        value = "0"
    }
}

resource "aws_db_instance" "postgres" {
    identifier             = "postgres"
    instance_class         = "db.t4g.micro"
    allocated_storage      = 5
    engine                 = "postgres"
    engine_version         = "15.3"
    username               = "postgres"
    password               = aws_secretsmanager_secret_version.rds_password.secret_string
    db_subnet_group_name   = aws_db_subnet_group.main.name
    vpc_security_group_ids = [aws_security_group.rds_sg.id]
    parameter_group_name   = aws_db_parameter_group.postgres_pg.name
    final_snapshot_identifier = false
}

resource "aws_security_group" "rds_sg" {
    name = "postgres"
    vpc_id = aws_vpc.vpc_app.id

    ingress {
        protocol = "tcp"
        from_port = 5432
        to_port = 5432
        cidr_blocks = ["0.0.0.0/0"]
        security_groups = [aws_security_group.alb_sg.id]
    }
    
    ingress {
        protocol = "tcp"
        from_port = 5432
        to_port = 5432
        cidr_blocks = ["0.0.0.0/0"]
        security_groups = [aws_security_group.rds_bastion_sg.id]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}