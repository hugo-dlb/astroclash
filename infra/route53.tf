resource "aws_route53_zone" "production" {
  name = "astroclash.io"
}

resource "namecheap_domain_records" "production" {
    domain = "astroclash.io"
    mode   = "OVERWRITE"

    nameservers = [
        aws_route53_zone.production.name_servers[0],
        aws_route53_zone.production.name_servers[1],
        aws_route53_zone.production.name_servers[2],
        aws_route53_zone.production.name_servers[3],
    ]
}

resource "aws_acm_certificate" "production_api" {
    domain_name       = "api.astroclash.io"
    validation_method = "DNS"
}

resource "aws_route53_record" "production_api_certificate_validation" {
    for_each = {
            for dvo in aws_acm_certificate.production_api.domain_validation_options : dvo.domain_name => {
            name   = dvo.resource_record_name
            record = dvo.resource_record_value
            type   = dvo.resource_record_type
        }
    }

    allow_overwrite = true
    name            = each.value.name
    records         = [each.value.record]
    ttl             = 60
    type            = each.value.type
    zone_id         = aws_route53_zone.production.zone_id
}

resource "aws_acm_certificate_validation" "production_api" {
    certificate_arn         = aws_acm_certificate.production_api.arn
    validation_record_fqdns = [for record in aws_route53_record.production_api_certificate_validation : record.fqdn]
}

resource "aws_route53_record" "production_api" {
    zone_id = aws_route53_zone.production.zone_id
    name    = "api.astroclash.io"
    type    = "A"

    alias {
        name                   = aws_lb.main.dns_name
        zone_id                = aws_lb.main.zone_id
        evaluate_target_health = true
    }
}