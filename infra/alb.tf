resource "aws_lb" "main" {
    name               = "alb"
    internal           = false
    load_balancer_type = "application"
    security_groups    = ["${aws_security_group.security_group_alb.id}"]
    subnets            = ["${aws_subnet.public_a.id}", "${aws_subnet.public_b.id}"]
}
 
resource "aws_alb_target_group" "main" {
    name        = "main"
    port        = 80
    protocol    = "HTTP"
    vpc_id      = "${aws_vpc.vpc_app.id}"
    target_type = "ip"
}

resource "aws_alb_listener" "http" {
    load_balancer_arn = "${aws_lb.main.id}"
    port              = 80
    protocol          = "HTTP"

    default_action {
        type = "redirect"

        redirect {
            port        = 443
            protocol    = "HTTPS"
            status_code = "HTTP_301"
        }
    }
}
    
resource "aws_alb_listener" "https" {
    load_balancer_arn = "${aws_lb.main.id}"
    port              = 80
    protocol          = "HTTP"
    
    # ssl_policy        = "ELBSecurityPolicy-2016-08"
    # certificate_arn   = var.alb_tls_cert_arn
    
    default_action {
        target_group_arn = "${aws_alb_target_group.main.id}"
        type             = "forward"
    }
}

resource "aws_security_group" "security_group_alb" {
    name   = "security_group_alb"
    vpc_id = "${aws_vpc.vpc_app.id}"
    
    ingress {
        protocol         = "tcp"
        from_port        = 80
        to_port          = 80
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }
    
    ingress {
        protocol         = "tcp"
        from_port        = 443
        to_port          = 443
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }
    
    egress {
        protocol         = "-1"
        from_port        = 0
        to_port          = 0
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }
}