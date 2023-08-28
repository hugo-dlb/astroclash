resource "aws_security_group" "rds_bastion_sg" {
    name = "rds-bastion-sg"
    vpc_id = aws_vpc.vpc_app.id

    ingress {
        protocol = "tcp"
        from_port = 22
        to_port = 22
        cidr_blocks = ["131.117.153.236/32"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_instance" "rds_bastion" {
    ami           = "ami-057b6e529186a8233"
    instance_type = "t2.micro"
    subnet_id = aws_subnet.public_a.id
    security_groups = [aws_security_group.rds_bastion_sg.id]
    associate_public_ip_address = true
    key_name = "RDS"
}