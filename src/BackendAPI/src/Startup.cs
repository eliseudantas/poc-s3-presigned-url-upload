using Enyim.Caching.Memcached;
using StackExchange.Redis;
using Amazon.StepFunctions;
using Amazon.DynamoDBv2;

namespace BackendAPI;


    
public class Startup
{
     private string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container
    public void ConfigureServices(IServiceCollection services)
    {
       
  

        services.AddCors(options =>
        {
            options.AddPolicy(name: MyAllowSpecificOrigins,
                            policy =>
                            {
                                policy.AllowAnyOrigin() // not a safe practice
                                      .AllowAnyHeader()
                                      .AllowAnyMethod();	
                            });
        });

         services.AddControllers();


        services.AddLogging(logging =>   
        {
            // Add AWS Lambda logger as a provider
            logging.AddLambdaLogger(new LambdaLoggerOptions
            {
                IncludeLogLevel = true,
                IncludeCategory = true,
                IncludeNewline = true,
                IncludeEventId = true
            });
            logging.AddConsole();
            logging.AddDebug();
        });
        
        services.AddSingleton<IAmazonStepFunctions>(x => new AmazonStepFunctionsClient());
        services.AddSingleton<IAmazonDynamoDB>(x => new AmazonDynamoDBClient());

    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthorization();

        app.UseCors(MyAllowSpecificOrigins);        

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapGet("/", async context =>
            {
                await context.Response.WriteAsync(" :) ");
            });
        });


    }
}