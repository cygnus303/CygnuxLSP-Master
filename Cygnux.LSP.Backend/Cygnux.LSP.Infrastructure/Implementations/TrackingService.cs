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

    public async Task<IEnumerable<TrackingDocketResponse>> GetTrackigList(string? docketNOs, Guid userid, string? fromDate, string? toDate, int skip, int take)
    {
        var parameters = new DynamicParameters();
        string cleanedDocketNOs = (docketNOs == "''" || string.IsNullOrWhiteSpace(docketNOs)) ? "" : docketNOs.Trim();
        parameters.Add("@docknumber", cleanedDocketNOs, DbType.String);
        parameters.Add("@UserId", userid, DbType.Guid);
        parameters.Add("@FromDate", fromDate, DbType.String);
        parameters.Add("@ToDate", toDate, DbType.String);
        parameters.Add("@Skip", skip, DbType.Int32);
        parameters.Add("@Take", take, DbType.Int32);

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
    public async Task<IEnumerable<TrackingChartResponse>> GetTransportChartData(Guid userId, string fromDate, string toDate)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@FromDate", fromDate, DbType.String);
        parameters.Add("@ToDate", toDate, DbType.String);

        return await _dbConnection.QueryAsync<TrackingChartResponse>(
            StoredProcedureConstants.USP_DocketTransModeCount, 
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<DownloadPODResponse>> DownloadPOD(Guid userId, string StartDate, string EndDate)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@StartDate", StartDate, DbType.String);
        parameters.Add("@EndDate", EndDate, DbType.String);

        return await _dbConnection.QueryAsync<DownloadPODResponse>(
            StoredProcedureConstants.Usp_DownloadPOD,
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }
}