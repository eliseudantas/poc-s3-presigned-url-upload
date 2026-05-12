# S3 upload with Presigned URL

## A Poem

*A client wants to share a file,*
*but sending through the server? That takes a while.*
*So Lambda steps in with a token in hand,*
*a presigned URL — exactly as planned.*

*API Gateway listens, a request comes through,*
*the .NET Lambda knows just what to do.*
*It signs the path to the S3 shore,*
*and hands it back — no proxy, no more.*

*The Angular frontend, sleek and bright,*
*takes that URL and uploads with might.*
*Straight to the bucket, no middleman's cost,*
*not a single byte of bandwidth lost.*

*SAM builds it all with a command or two,*
*`sam build`, `sam deploy` — and the cloud is brand new.*
*When the demo is done and the resources must go,*
*`sam delete` sweeps clean, leaving nothing below.*

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

