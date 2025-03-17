using Cygnux.LSP.Identity.Contracts;
using Cygnux.LSP.Identity.Entities;

namespace Cygnux.LSP.Identity.Implementations;

using Microsoft.AspNetCore.Identity;
using Models;

internal class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;

    private readonly IJwtService _jwtService;

    public AuthService(UserManager<ApplicationUser> userManager, IJwtService jwtService)
    {
        _userManager = userManager;
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
                return new BaseLoginResponse<LoginResponse>(new LoginResponse
                {
                    Token = token,
                    Roles = roles
                });
            }
            return new BaseLoginResponse<LoginResponse>(false, message: "Password is incorrect.");
        }
        return new BaseLoginResponse<LoginResponse>(false, message: "User doen't exist in system.");
    }
}