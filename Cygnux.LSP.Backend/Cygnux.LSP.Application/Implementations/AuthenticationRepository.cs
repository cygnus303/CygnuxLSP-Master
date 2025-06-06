namespace Cygnux.LSP.Application.Implementations;
using Contracts;
using Infrastructure.Contracts;


internal class AuthenticationRepository : IAuthenticationRepository
{
    private readonly IAuthenticationservice _authenticationService;

    public AuthenticationRepository(IAuthenticationservice authenticationService)
    {
        _authenticationService = authenticationService;
    }


}