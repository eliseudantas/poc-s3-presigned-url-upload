# LambdaVault

**LambdaVault** is a serverless file upload solution that uses AWS Lambda and API Gateway to generate S3 presigned URLs, enabling secure direct-to-S3 uploads from the browser. The presigned URL is created by the backend API (API Gateway + Lambda) and returned to the client, which then uses it to upload files directly to the S3 bucket.

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

