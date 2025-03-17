namespace Cygnux.LSP.Application.Implementations;

using Contracts;
using Identity.Contracts;
using Identity.Models;
using Models.Request.Auth;
using Models.Response;

internal class AuthRepository : IAuthRepository
{
    private readonly IAuthService _authService;

    public AuthRepository(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<BaseResponse<LoginResponse?>> LoginAsync(UserLoginRequest loginRequest)
    {
        var response = await _authService.LoginAsync(loginRequest.Email, loginRequest.Password);
        return !response.IsSuccess ? new BaseResponse<LoginResponse?>(new ErrorResponse { Message = response.Message }) : new BaseResponse<LoginResponse?>(response.Data);
    }
}