using Cygnux.LSP.Api.Hubs;
using Cygnux.LSP.Api.IoC;
using Cygnux.LSP.Api.Middleware;
using Cygnux.LSP.Application.Contracts;
using Cygnux.LSP.Identity.IoC;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureApiServices(builder.Configuration);
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("https://uatlsp.cygnux.in")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

    
var app = builder.Build();
var loggerFactory = app.Services.GetService<ILoggerFactory>();
loggerFactory?.AddFile(builder.Configuration["Logging:LogFilePath"]?.ToString());

//await app.Services.ApplyMigrations();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CygnuxLSP.API v1"));
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("CorsPolicy");

//app.UseCors("AllowOrigin");

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
           Path.Combine(builder.Environment.ContentRootPath, "Uploads")),
    RequestPath = "/Uploads"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
           Path.Combine(builder.Environment.ContentRootPath, "PODUpload")),
    RequestPath = "/PODUpload"
});
app.UseAuthentication();
app.UseAuthorization();
app.MapHub<SignalRHub>("/signalRHub");
//app.UseEndpoints(endpoints =>
//{
//    endpoints.MapControllers();
//    endpoints.MapHub<SignalRHub>("/signalRHub");
//});


app.MapControllers();

app.UseMiddleware<AuthorizationHeaderMiddleware>();
app.UseMiddleware<ExceptionMiddleware>();

await app.RunAsync();