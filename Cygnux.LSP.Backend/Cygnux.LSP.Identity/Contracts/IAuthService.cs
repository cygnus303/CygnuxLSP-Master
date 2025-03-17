namespace Cygnux.LSP.Identity.Contracts;

using Models;

public interface IAuthService
{
    Task<BaseLoginResponse<LoginResponse>> LoginAsync(string email, string password);
}