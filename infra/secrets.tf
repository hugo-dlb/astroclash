resource "random_password" "rds_password" {
    length           = 16
    special          = true
    override_special = "_!%^"
}

resource "aws_secretsmanager_secret" "rds_password" {
    name = "rds-password"
}

resource "aws_secretsmanager_secret_version" "rds_password" {
    secret_id = aws_secretsmanager_secret.rds_password.id
    secret_string = random_password.rds_password.result
}