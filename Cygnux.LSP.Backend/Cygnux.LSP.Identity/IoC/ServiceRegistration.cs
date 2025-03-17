namespace Cygnux.LSP.Identity.IoC;

using Contracts;
using Entities;
using Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class ServiceRegistration
{
    /// <summary>
    /// Register services to the dependency injection.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <param name="connectionString"></param>
    /// <returns></returns>
    public static void ConfigureIdentityServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
         options.UseSqlServer(
         configuration.GetConnectionString("DefaultConnection"),
         sqlServerOptions => sqlServerOptions
            .MigrationsAssembly("Cygnux.LSP.Identity") // Specify migrations assembly if needed
            .EnableRetryOnFailure() // Optional: Retry on transient errors
          ));

        services.AddIdentityCore<ApplicationUser>(options =>
        {
            // Password settings
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = true;
            options.Password.RequireLowercase = true;

            // Lockout settings
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            options.Lockout.MaxFailedAccessAttempts = 5;
        })
       .AddRoles<ApplicationRole>()
       .AddEntityFrameworkStores<AppDbContext>();

        services.AddSingleton<IJwtService, JwtService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IUserRoleService, UserRoleService>();
    }

    /// <summary>
    ///
    /// </summary>
    /// <param name="serviceProvider"></param>
    public static async Task ApplyMigrations(this IServiceProvider serviceProvider)
    {
        using (var scope = serviceProvider.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await dbContext.Database.MigrateAsync(); // Applies any pending migrations
        }
    }
}