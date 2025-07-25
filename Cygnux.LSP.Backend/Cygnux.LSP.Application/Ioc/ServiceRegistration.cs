namespace Cygnux.LSP.Application.IoC;

using Contracts;
using Cygnux.LSP.Infrastructure.Contracts;
using Identity.IoC;
using Implementations;
using Infrastructure.IoC;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class ServiceRegistration
{
    public static void ConfigureApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<ILspRepository, LspRepository>();
        services.AddScoped<ICustomerLspRepository, CustomerLspRepository>();
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IUserRoleRepository, UserRoleRepository>();
        services.AddScoped<IMenuRepository, MenuRepository>();
        services.AddScoped<IDocketRepository, DocketRepository>();
        services.AddScoped<ITrackingRepository, TrackingRepository>();
        services.AddScoped<IAuthenticationRepository, AuthenticationRepository>();
        services.AddScoped<IRoleMenuPermissionRepository, RoleMenuPermissionRepository>();
        services.AddScoped<IGeneralMasterRepository, GeneralMasterRepository>();

        services.ConfigureIdentityServices(configuration);
        services.ConfigureInfrastructureServices(configuration);
    }
}