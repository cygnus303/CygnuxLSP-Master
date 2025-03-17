using CygnuxLSP.Web.Services.Implementation;
using CygnuxLSP.Web.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

Uri apiAddress = new(builder.Configuration["API:Address"]);
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
  .AddCookie(options =>
  {
      options.Cookie.Name = "Identity.Cookie";
      options.LoginPath = "/Login/Index";
      options.SlidingExpiration = true;
      options.AccessDeniedPath = "/AccessDenied";
  });
builder.Services.AddMvc();

builder.Services.AddHttpClient<IAuthClient, AuthClient>(client => { client.BaseAddress = apiAddress; });
builder.Services.AddHttpClient<IMasterClient, MasterClient>(client => { client.BaseAddress = apiAddress; });
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Add services to the container.
builder.Services.AddControllersWithViews().AddNewtonsoftJson();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
else
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
