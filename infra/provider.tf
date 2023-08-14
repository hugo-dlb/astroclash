terraform {
    required_providers {
        namecheap = {
            source  = "namecheap/namecheap"
            version = ">= 2.0.0"
        }
    }
}

provider "aws" {
    region  = "eu-west-1"
    profile = "Test"
}

provider "namecheap" {
    user_name   = var.namecheap_api_username
    api_user    = var.namecheap_api_username
    api_key     = var.namecheap_api_key
    use_sandbox = false
}