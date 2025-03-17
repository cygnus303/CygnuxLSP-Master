namespace Cygnux.LSP.Application.Contracts;

using Identity.Models;
using Models.Request.Auth;
using Models.Response;

public interface IAuthRepository
{
    public Task<BaseResponse<LoginResponse?>> LoginAsync(UserLoginRequest loginRequest);
}