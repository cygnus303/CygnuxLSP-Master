using Cygnux.LSP.Api.IoC;
using Cygnux.LSP.Api.Middleware;
using Cygnux.LSP.Application.Contracts;
using Cygnux.LSP.Identity.IoC;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureApiServices(builder.Configuration);
builder.Services.AddScoped<IEmailService, EmailService>();

var app = builder.Build();
var loggerFactory = app.Services.GetService<ILoggerFactory>();
loggerFactory?.AddFile(builder.Configuration["Logging:LogFilePath"]?.ToString());

//await app.Services.ApplyMigrations();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CygnuxLSP.API v1"));

app.UseRouting();

app.UseCors("AllowOrigin");

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
app.MapControllers();

app.UseMiddleware<AuthorizationHeaderMiddleware>();
app.UseMiddleware<ExceptionMiddleware>();

await app.RunAsync();