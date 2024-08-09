# strapi-webhook-action-with-lambda
[![Main CI](https://github.com/missbritz/strapi-webhook-action-support-using-lambda/actions/workflows/main-ci.yml/badge.svg)](https://github.com/missbritz/strapi-webhook-action-support-using-lambda/actions/workflows/main-ci.yml)

A simple and lightweight Node.js api built with lambda to support Strapi webhook that will trigger Github action's workflow dispatch event.

### How to use
---
1. Build the package
   `docker build -t <IMAGE NAME> .`

2. Run the container to test locally
   `docker run --env-file .env -p 9000:8080 <IMAGE NAME>`

3. Once container is up and running, you can test this by doing a request through this cUrl command `curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d "{}"`

### Prerequisite
---
1. Docker installed in your machine
2. Have created AWS ECR to configure in your Github Secrets for storing image.
3. Have created the Lambda function that will use your container image and as to where your environment variables will be.
