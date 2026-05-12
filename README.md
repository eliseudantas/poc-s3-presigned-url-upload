# S3 upload with Presigned URL

## A Poem

*A client wants to upload a file,*
*But handing out credentials? That's not the style.*
*So Lambda steps in with a secret in hand,*
*A presigned URL — exactly as planned.*

*API Gateway receives the request,*
*And signs a short-lived key to put it to rest.*
*The client takes the URL, no AWS keys to share,*
*And uploads straight to S3 — straight through the air.*

*Angular renders the form with care,*
*SAM deploys the stack without a prayer.*
*Buckets and functions, all defined as code,*
*A serverless pattern to lighten the load.*


This is a simple example of how to create a presigned URL to upload a file to an S3 bucket. In this example, the presigned URL is created by a API (Api Gateway + Lambda) and returned to the client. The client can then use the URL to upload a file to the S3 bucket.

Note: you need the SAM CLI installed. 

https://docs.aws.amazon.com/pt_br/serverless-application-model/latest/developerguide/install-sam-cli.html

```bash
sam build
sam deploy --guided
```

The result of the deployment will be the API Gateway URL. You can use this URL to create a presigned URL to upload a file to the S3 bucket.sam

The output looks like this:

```bash
-----------------------------  
Key                 BackendApi
Description         API Gateway endpoint URL for Prod stage for BackendAPI function
Value               https://xxxxxxxx.execute-api.us-east-2.amazonaws.com/Prod/

Key                 S3Bucket
Description         S3 Bucket
Value               arn:aws:s3:::file-upload-demo-appbucket-xxxxxxxx
-----------------------------  
```

Update the file `config.ts` in the Frontend project with the API Gateway URL and the S3 bucket name.

Now, you can run the Frontend project:

```bash
cd .\src\Frontend\ 
npm install
ng serve --open
```

## Delete the resources

To delete the resources created by the SAM template, you can run the following command:

```bash
sam delete
```

