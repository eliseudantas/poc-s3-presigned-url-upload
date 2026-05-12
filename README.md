# S3 upload with Presigned URL

## A Poem

A client calls the API with care,
"I need to upload, but how do I dare?"
The Lambda wakes, signs a URL with grace,
A fleeting token, a key to S3 space.

The Angular app sends the file on its way,
No secrets exposed, credentials won't stray.
SAM builds the scaffold — Gateway, Lambda, Bucket —
A serverless stack, and nothing can chuck it.

Deploy with a guide, then watch the output appear,
An ARN, an endpoint — the resources are here.
When done, run `sam delete`, let the cloud breathe free,
Such is the beauty of presigned URL thee.

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

