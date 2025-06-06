namespace Cygnux.LSP.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Dapper;
using Models.Response;

using System.Data;

internal class AuthenticationService : IAuthenticationservice
{
    private readonly IDbConnection _dbConnection;

    public AuthenticationService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    
}