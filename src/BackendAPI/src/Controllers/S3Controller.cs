using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Amazon.S3;
using Amazon.S3.Model;
using System.Security.Cryptography;

namespace BackendAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class S3Controller : ControllerBase
    {
        private const string S3_BUCKET = "APP_BUCKET";
        private readonly IConfiguration Configuration;

        public S3Controller(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public class S3Object
        {
            public string FileName { get; set; }
            public string FileType { get; set; }
            public string UserId { get; set; }
            public string Status { get; set; }
            public int RowCount { get; set; }
        }

        [HttpPost("get-presigned-url-upload")]
        public async Task<IActionResult> GetPresignedUrl(S3Object s3Object)
        {
            var uuid_key = Guid.NewGuid().ToString();

            var bucketName = GetBucketName();

            using (var client = new AmazonS3Client())
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = bucketName,
                    Key = uuid_key,
                    Expires = DateTime.UtcNow.AddSeconds(250),
                    ContentType = s3Object.FileType, 
                    Verb = HttpVerb.PUT
                };

                request.Metadata.Add("FileName", s3Object.FileName);
                request.Metadata.Add("UploadedBy", s3Object.UserId);
                request.Metadata.Add("Status", s3Object.Status);
                request.Metadata.Add("RowCount", s3Object.RowCount.ToString());

                string url = await client.GetPreSignedURLAsync(request);

                return Ok(new { 
                    uploadUrl = url, 
                    key = uuid_key 
                    });
            }
        }

        public class PresignedUrlRequest
        {
            public string Key { get; set; }
        }

        [HttpPost("get-presigned-url-download")]
        public async Task<IActionResult> GetPresignedUrlDownload([FromBody] PresignedUrlRequest payload)
        {
            var bucketName = GetBucketName();

            using (var client = new AmazonS3Client())
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = bucketName,
                    Key = payload.Key,
                    Expires = DateTime.UtcNow.AddSeconds(250),
                    ContentType = "text/csv",
                    Verb = HttpVerb.GET
                };

                string url = await client.GetPreSignedURLAsync(request);

                return Ok(new { downloadUrl = url });
            }
        }

        [HttpPost("delete-file")]
        public async Task<IActionResult> GetPresignedUrlDelete([FromBody] PresignedUrlRequest payload)
        {
            var bucketName = GetBucketName();

            using (var client = new AmazonS3Client())
            {
                var deleteObjectRequest = new DeleteObjectRequest
                {
                    BucketName = bucketName,
                    Key = payload.Key
                };

                var response = await client.DeleteObjectAsync(deleteObjectRequest);

                if (response.HttpStatusCode == System.Net.HttpStatusCode.NoContent)
                {
                    return Ok(new { message = "File deleted successfully" });
                }
                else
                {
                    return StatusCode((int)response.HttpStatusCode, new { message = "Failed to delete file" });
                }
            }
        }

        [HttpGet("list-objects")]
        public async Task<IActionResult> ListObjects()
        {
            var bucketName = GetBucketName();

            using (var client = new AmazonS3Client())
            {
            var request = new ListObjectsV2Request
            {
                BucketName = bucketName
            };

            var response = await client.ListObjectsV2Async(request);

            var objects = response.S3Objects.Select(o => new
            {
                Key = o.Key,
                Size = o.Size,
            });

            return Ok(objects);
            }
        }
        

        private string GetBucketName() => Configuration[S3_BUCKET] ?? throw new Exception("S3 bucket name not found");

        [HttpGet]
        public string Get()
        {
           return GetBucketName();
        }
    }
}
