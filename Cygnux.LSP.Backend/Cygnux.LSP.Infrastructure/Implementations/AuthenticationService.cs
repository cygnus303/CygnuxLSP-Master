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

    public async Task<CommonCreateResponse> AddOTPDetails(string otpentry)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@JsonInput", otpentry, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.USP_OtpVerification,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }
}