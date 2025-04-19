using Cygnux.LSP.Identity.Contracts;
using Cygnux.LSP.Identity.Entities;

namespace Cygnux.LSP.Identity.Implementations;

using Microsoft.AspNetCore.Identity;
using Models;

internal class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;

    private readonly IJwtService _jwtService;

    public AuthService(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IJwtService jwtService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _jwtService = jwtService;
    }

    public async Task<BaseLoginResponse<LoginResponse>?> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByNameAsync(email);
        if (user is not null)
        {
            if (!user.IsActive)
            {
                return new BaseLoginResponse<LoginResponse>(false, message: "User is inactive.");
            }
            if (user.IsDeleted)
            {
                return new BaseLoginResponse<LoginResponse>(false, message: "User is deleted from the sytem.");
            }

            var isPassword = await _userManager.CheckPasswordAsync(user, password);
            if (isPassword)
            {
                var token = _jwtService.GenerateEncodedToken(user);
                var roles = await _userManager.GetRolesAsync(user);
                var roleName = roles.FirstOrDefault();
                string? roleId = null;
                if (!string.IsNullOrEmpty(roleName))
                {
                    var role = await _roleManager.FindByNameAsync(roleName);
                    if (role != null)
                    {
                        roleId = await _roleManager.GetRoleIdAsync(role);
                    }
                }

                return new BaseLoginResponse<LoginResponse>(new LoginResponse
                {
                    Token = token,
                    Roles = roleName, 
                    Email = email,
                    RoleId = roleId    
                });
            }
            return new BaseLoginResponse<LoginResponse>(false, message: "Password is incorrect.");
        }
        return new BaseLoginResponse<LoginResponse>(false, message: "User doen't exist in system.");
    }
}