# S3 upload with Presigned URL

## A Poem

A file waits patiently to travel far,
Through clouds and code, beneath a digital star.
A Lambda wakes, a URL it signs,
A secret handshake written between the lines.

The client receives it, a key to the gate,
It calls upon S3, uploads its freight.
No secrets exposed, no credentials in sight,
Just a presigned promise that glimmers with light.

API Gateway guards the path with care,
An Angular frontend beyond compare.
SAM builds the stack, deploys with a run,
And files reach the bucket — the journey is done.

---


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

