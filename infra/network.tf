resource "aws_vpc" "vpc_app" {
    cidr_block = "10.0.0.0/16"
    enable_dns_hostnames = true
    enable_dns_support = true
}

resource "aws_subnet" "public_a" {
    vpc_id = "${aws_vpc.vpc_app.id}"
    cidr_block = "10.0.1.0/24"
    availability_zone = "${var.aws_region}a"
}

resource "aws_subnet" "public_b" {
    vpc_id = "${aws_vpc.vpc_app.id}"
    cidr_block = "10.0.2.0/24"
    availability_zone = "${var.aws_region}b"
}

resource "aws_subnet" "private_a" {
    vpc_id = "${aws_vpc.vpc_app.id}"
    cidr_block = "10.0.3.0/24"
    availability_zone = "${var.aws_region}a"
}

resource "aws_subnet" "private_b" {
    vpc_id = "${aws_vpc.vpc_app.id}"
    cidr_block = "10.0.4.0/24"
    availability_zone = "${var.aws_region}b"
}

resource "aws_route_table" "public_route_table" {
    vpc_id = "${aws_vpc.vpc_app.id}"

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = "${aws_internet_gateway.internet_gateway.id}"
    }
}

resource "aws_route_table" "private_route_table_a" {
    vpc_id = "${aws_vpc.vpc_app.id}"

    route {
        cidr_block      = "0.0.0.0/0"
        nat_gateway_id  = aws_nat_gateway.public_a.id
    }
}

resource "aws_route_table" "private_route_table_b" {
    vpc_id = "${aws_vpc.vpc_app.id}"

    route {
        cidr_block      = "0.0.0.0/0"
        nat_gateway_id  = aws_nat_gateway.public_b.id
    }
}

resource "aws_route_table_association" "public_a" {
    subnet_id = aws_subnet.public_a.id
    route_table_id = "${aws_route_table.public_route_table.id}"
}

resource "aws_route_table_association" "public_b" {
    subnet_id = aws_subnet.public_b.id
    route_table_id = "${aws_route_table.public_route_table.id}"
}

resource "aws_route_table_association" "private_a" {
    subnet_id = aws_subnet.private_a.id
    route_table_id = "${aws_route_table.private_route_table_a.id}"
}

resource "aws_route_table_association" "private_b" {
    subnet_id = aws_subnet.private_b.id
    route_table_id = "${aws_route_table.private_route_table_b.id}"
}

resource "aws_internet_gateway" "internet_gateway" {
    vpc_id = "${aws_vpc.vpc_app.id}"
}

resource "aws_nat_gateway" "public_a" {
    allocation_id = aws_eip.public_a.id
    subnet_id     = aws_subnet.public_a.id
    depends_on    = [aws_internet_gateway.internet_gateway]
}

resource "aws_nat_gateway" "public_b" {
    allocation_id = aws_eip.public_b.id
    subnet_id     = aws_subnet.public_b.id
    depends_on    = [aws_internet_gateway.internet_gateway]
}
 
resource "aws_eip" "public_a" {
    domain = "vpc"
}

resource "aws_eip" "public_b" {
    domain = "vpc"
}