using Cygnux.LSP.Infrastructure.Contracts;
using Cygnux.LSP.Infrastructure.Implementations;

namespace Cygnux.LSP.Infrastructure.IoC;

using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Data;

public static class ServiceRegistration
{
    public static void ConfigureInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IUserSettings, UserSettings>();

        // Add Dapper or other DB connection service
        services.AddScoped<IDbConnection>(sp => new SqlConnection(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<ILspService, LspService>();
        services.AddScoped<ICustomerLspService, CustomerLspService>();
        services.AddScoped<IMenuService, MenuService>();
        services.AddScoped<IDocketService, DocketService>();
        services.AddScoped<IRoleMenuPermissionService, RoleMenuPermissionService>();
    }
}