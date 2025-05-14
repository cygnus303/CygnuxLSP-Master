namespace Cygnux.LSP.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Dapper;
using Models.Response;

using System.Data;

internal class TrackingService : ITrackingservice
{
    private readonly IDbConnection _dbConnection;

    public TrackingService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<DocketListResponse>> GetTrackigList(string docketNOs, Guid userid)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@docknumber", docketNOs, DbType.String);
        parameters.Add("@UserId", userid, DbType.Guid);

        return await _dbConnection.QueryAsync<DocketListResponse>(
             StoredProcedureConstants.Usp_TrackingList,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }
}