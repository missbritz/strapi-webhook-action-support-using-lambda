# strapi-webhook-action-with-lambda
A simple and lightweight API as a Lambda function that will trigger Github action's workflow dispatch event.

##### Prerequisite
- Docker
- ECR
- Lambda
- Github
- AWS CLI

### How to use
1. Build the package
`docker build -t <IMAGE NAME> .`

2. *Optional:* Tag your package.  The tag will be the identifier of the image in your ECR.  This is a required step before you push your image in ECR.
`docker tag <image name> <ECR URL>:<IMAGE TAG>`

3.  If you are aiming to deploy this, refer to **Deploy** section below.  For local testing, continue below.


### How to test
1. Run the container to test locally
`docker run -p <LOCAL PORT>:8080 <IMAGE NAME>`

2. Once container is up and running, you can test this by doing a request through **Postman** or you can use the curl command below:
`curl -i -X POST -H "ghx-user:<GITHUB USER>" -H "ghx-repo:<GITHUB REPO>" -H "ghx-branch:<GITHUB BRANCH>" -H "ghx-workflow:<GITHUB WORKFLOW FILE>" -H "authorization:<GITHUB TOKEN>" "http://localhost:<LOCAL PORT>/2015-03-31/functions/function/invocations"`
    

### Deploy to ECR
Optional: If you have authenticated to your ECR, you can skip this.
`aws ecr get-login-password | docker login --username AWS --password-stdin <ECR URL>`

Once you have your image built, tagged and ready to push to your ECR.
`docker push <ECR URL>:<IMAGE TAG>`

### Deploy to Lambda

