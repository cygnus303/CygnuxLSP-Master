namespace Cygnux.LSP.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
using Dapper;
using Models.Response;
using Models.Response.Docket;
using System.Data;

internal class DocketService : IDocketService
{
    private readonly IDbConnection _dbConnection;

    public DocketService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<DocketListResponse>> GetDocketList(int page, int pageSize, Guid userId, string? docketNo, string? fromLocation, string? toLocation, int? quantity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Page", page, DbType.Int32);
        parameters.Add("@PageSize", pageSize, DbType.Int32);
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@DocketNo", docketNo, DbType.String);
        parameters.Add("@FromLocation", fromLocation, DbType.String);
        parameters.Add("@ToLocation", toLocation, DbType.String);
        parameters.Add("@Quantity", quantity, DbType.Int32);

        return await _dbConnection.QueryAsync<DocketListResponse>(
             StoredProcedureConstants.Usp_GetDocket,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<DocketDetailResponse> GetDocketDetails(Guid docketId, Guid userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", docketId, DbType.Guid);
        parameters.Add("@UserId", userId, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<DocketDetailResponse>(
            StoredProcedureConstants.Usp_GetDocket,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new DocketDetailResponse();
    }
    public async Task<CommonCreateResponse> ImportDocket(string addDocketsJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@DocketJson", addDocketsJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_ImportDocket,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }
    public async Task<IEnumerable<TrackingList>> GetTrackingList(string codetype)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CodeType", codetype, DbType.String);
       
        return await _dbConnection.QueryAsync<TrackingList>(
         StoredProcedureConstants.USP_TrackingList,
         parameters,
         commandType: CommandType.StoredProcedure
        );
    }


    public async Task<CommonCreateResponse> AddDocket(string addDocketJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@DocketJson", addDocketJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Docket,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> UpdateDocket(Guid id, string updateDocketJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@DocketJson", updateDocketJson, DbType.String);
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
              StoredProcedureConstants.Usp_Docket,
              param: parameters,
              commandType: CommandType.StoredProcedure
          ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> DeleteDocket(Guid id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
              StoredProcedureConstants.USP_DeleteDocket,
              param: parameters,
              commandType: CommandType.StoredProcedure
          ) ?? new CommonCreateResponse();
    }

    /*public async Task<CommonCreateResponse> DeleteDocket(Guid id)
    {
        var deleteQuery = "Update Docket Set IsCancel = 1 Where Id = @Id";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "Docket Cancelled successfully" };
        }
        return new CommonCreateResponse();
    }*/

    public async Task<IEnumerable<LspTATData>> GetTATdata(Guid CustomerId, string? origin, string? destination)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerId", CustomerId, DbType.Guid);
        parameters.Add("@Origin", origin, DbType.String);
        parameters.Add("@Destination", destination, DbType.String);

        return await _dbConnection.QueryAsync<LspTATData>(
            StoredProcedureConstants.USP_CustomerTATRootDropdown,
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }
    public async Task<IEnumerable<DocketBulkUploadValidateResponse>> GetValidateDocketImportData(string bulkDocket,Guid customerid)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@JsonData", bulkDocket, DbType.String);
        parameters.Add("@CustomerID", customerid, DbType.Guid);

        return await _dbConnection.QueryAsync<DocketBulkUploadValidateResponse>(
            StoredProcedureConstants.USP_ValidateBulkUploadDocketData,
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<CommonCreateResponse> ImportPOD(string PodData,Guid User)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@JsonData", PodData, DbType.String);
        parameters.Add("@EntryBy", User, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.PODUplaodDataFromExcel,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }
}