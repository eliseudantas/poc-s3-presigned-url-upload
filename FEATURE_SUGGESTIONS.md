# Feature Suggestions

## 1. Complete Presigned URL Upload Integration
The frontend `UploadComponent` has placeholder upload logic (`this.http.post('your-api-endpoint', formData)`) instead of using the presigned URL flow that the backend provides. Completing this integration would enable secure, direct-to-S3 uploads that bypass the Lambda function for large files.

## 2. Add File Metadata Management
The backend stores metadata (FileName, UserId, Status, RowCount) as S3 object metadata but there's no way to query or manage this metadata. Adding endpoints to:
- Retrieve object metadata by key
- Update metadata without re-uploading the file
- Filter/list objects by metadata fields

## 3. Implement File Validation and Type Restrictions
Add file validation on both frontend and backend:
- MIME type validation
- File size limits
- File extension allowlists/blocklists
- Virus scanning integration (e.g., AWS Lambda with ClamAV)

## 4. Add Progress Tracking for Uploads/Downloads
Implement multipart upload support for large files:
- Upload progress bars in the frontend
- Chunked uploads via presigned URLs
- Resume interrupted uploads

## 5. Add Unit and Integration Tests
The project currently has minimal test coverage:
- Backend: Add tests for S3Controller endpoints
- Frontend: Expand the existing `upload.component.spec.ts` to test the complete upload flow
- Integration tests for the presigned URL workflow

## 6. Add Error Handling and Retry Logic
- Backend: Add proper error handling with specific HTTP status codes
- Frontend: Add retry logic for failed uploads
- User-friendly error messages for common failure scenarios

## 7. Add Environment Configuration
- Move hardcoded values (250 second expiry) to configuration
- Add support for multiple environments (dev/staging/prod)
- Add CORS configuration for API Gateway

## 8. Add Authentication and Authorization
Currently the API is open to anyone with the endpoint. Consider adding:
- AWS Cognito or JWT-based authentication
- User-specific file access controls
- Role-based access for admin operations (delete, list all)

## 9. Add File Download and Preview Features
The backend has a presigned download URL endpoint but the frontend doesn't use it. Add:
- File listing UI component
- Download functionality
- Preview for supported file types (images, PDFs, CSVs)

## 10. Add Logging and Monitoring
- Add structured logging to the backend
- AWS X-Ray tracing for Lambda functions
- CloudWatch dashboards for upload/download metrics
