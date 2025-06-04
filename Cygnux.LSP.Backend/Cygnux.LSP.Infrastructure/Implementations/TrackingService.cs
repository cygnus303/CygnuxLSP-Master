namespace Cygnux.LSP.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Cygnux.LSP.Infrastructure.Models.Response.Tracking;
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

    public async Task<IEnumerable<TrackingDocketResponse>> GetTrackigList(string docketNOs, Guid userid)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@docknumber", docketNOs, DbType.String);
        parameters.Add("@UserId", userid, DbType.Guid);

        return await _dbConnection.QueryAsync<TrackingDocketResponse>(
             StoredProcedureConstants.Usp_TrackingList,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }
    public async Task<IEnumerable<Trackinglist>> GetDashboardList(Guid userid, string fromDate, string toDate)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userid, DbType.Guid);
        parameters.Add("@FromDate", fromDate, DbType.String);
        parameters.Add("@ToDate", toDate, DbType.String);

        return await _dbConnection.QueryAsync<Trackinglist>(
             StoredProcedureConstants.USP_DocketCount,
             parameters,
             commandType: CommandType.StoredProcedure
         );


    }

}