# PresignedPortal

PresignedPortal is a proof-of-concept demonstrating secure, direct browser-to-S3 file uploads using AWS presigned URLs. Instead of routing file data through the backend, the server acts only as a portal — generating short-lived presigned credentials so the client can upload directly to S3, reducing cost and latency.

## Architecture

```
Browser (Angular SPA)
    │
    │ 1. POST /api/S3/get-presigned-url-upload
    ▼
AWS API Gateway → AWS Lambda (.NET 8 / ASP.NET Core)
                        │ 2. Returns presigned PUT URL
                        ▼
Browser uploads directly to AWS S3 (bypasses Lambda)
```

**Tech stack:**
- **Frontend:** Angular 18, TypeScript, Tailwind CSS
- **Backend:** ASP.NET Core Web API on AWS Lambda (.NET 8)
- **Infrastructure:** AWS SAM (API Gateway, Lambda, S3, IAM)
- **Region:** `us-east-2`

## Prerequisites

- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- Node.js + Angular CLI (`npm install -g @angular/cli`)
- .NET 8 SDK

## Deploy the Backend

```bash
sam build
sam deploy --guided
```

After deployment, the output will show:

```
-----------------------------
Key          BackendApi
Description  API Gateway endpoint URL for Prod stage for BackendAPI function
Value        https://xxxxxxxx.execute-api.us-east-2.amazonaws.com/Prod/

Key          S3Bucket
Description  S3 Bucket
Value        arn:aws:s3:::file-upload-demo-appbucket-xxxxxxxx
-----------------------------
```

## Configure the Frontend

Update `src/Frontend/src/config.ts` with the API Gateway URL and S3 bucket name from the deployment output.

## Run the Frontend

```bash
cd src/Frontend
npm install
ng serve --open
```

## Features

- **Direct S3 upload:** File data never passes through Lambda — only the presigned URL request does.
- **Upload progress:** Real-time progress bar during upload.
- **File management:** List, download, and delete uploaded files.
- **CSV generator:** Built-in tool to generate random test CSV files.
- **Job history:** Upload job status tracked locally in `localStorage`.

## Tear Down

To delete all AWS resources created by this stack:

```bash
sam delete
```

> **Note:** CORS is configured to allow any origin for demo purposes. Restrict origins before using in production.
