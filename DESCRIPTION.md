# Project Description

## S3 Presigned URL File Upload — Proof of Concept

A full-stack proof-of-concept demonstrating browser-to-S3 direct file uploads using AWS S3 presigned URLs. Files are uploaded directly from the browser to S3 without passing through the server, reducing backend load and enabling efficient large-file transfers.

## How It Works

1. The browser requests a time-limited presigned URL from the backend API.
2. The API (AWS Lambda behind API Gateway) generates and returns the presigned URL.
3. The browser uploads the file directly to S3 using an HTTP `PUT` to that URL.

The same presigned URL pattern is used for downloading files. Delete and list operations are also supported.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 18, TypeScript, Tailwind CSS |
| Backend | ASP.NET Core (.NET 8), deployed as AWS Lambda |
| Infrastructure | Amazon S3, API Gateway, AWS SAM |

## Key Features

- Direct browser-to-S3 file upload via presigned URLs
- File listing, download, and delete operations
- Serverless backend deployed with AWS SAM
- Infrastructure-as-Code ready (`template.yaml`)
