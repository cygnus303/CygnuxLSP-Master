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
    
    public async Task<IEnumerable<DocketListResponse>> GetDocketList(Guid userId,string reqFilter)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@jsonReq", reqFilter, DbType.String);

        return await _dbConnection.QueryAsync<DocketListResponse>(
             StoredProcedureConstants.Usp_GetDocket_New,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<IEnumerable<DownloadDocketResponse>> DownloadDocket(Guid userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);

        return await _dbConnection.QueryAsync<DownloadDocketResponse>(
              StoredProcedureConstants.Usp_DownloadDocket,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }

    public async Task<DocketDetailResponse> GetDocketDetails(Guid docketId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", docketId, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<DocketDetailResponse>(
            StoredProcedureConstants.USP_GetDocketDetail,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new DocketDetailResponse();
    }


    public async Task<IEnumerable<City_Master>> GetCityData(string SearchTerm)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@SearchTerm", SearchTerm, DbType.String);

        return await _dbConnection.QueryAsync<City_Master>(
            StoredProcedureConstants.USP_GetCity,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ;
    } 
    
    public async Task<IEnumerable<State_Master>> GetStateData(string SearchTerm)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@SearchTerm", SearchTerm, DbType.String);

        return await _dbConnection.QueryAsync<State_Master>(
            StoredProcedureConstants.USP_GetState,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ;
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

    public async Task<IEnumerable<DocList>> GetDocketData(string docketno)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@DocketNo", docketno, DbType.String);

        return await _dbConnection.QueryAsync<DocList>(
         StoredProcedureConstants.USP_FetchDockData,
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

    public async Task<CommonCreateResponse> SingleDocketStsUpdate(Guid DocketId, string docksts, Guid user)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@ID", DocketId, DbType.Guid);
        parameters.Add("@docketSts", docksts, DbType.String);
        parameters.Add("@userID", user, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
              StoredProcedureConstants.USP_DocketStatusUpdate_Single,
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

        public async Task<CommonCreateResponse> DocketCancel(Guid id, Guid userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);
        parameters.Add("@UserId", userId, DbType.Guid);

        var result = await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.USP_DeleteCancel,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
        return result;
    }
    public async Task<CommonCreateResponse> DocketReject(Guid id, Guid userId, string? remarks = null)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@Remarks", remarks ?? string.Empty, DbType.String);

        var result = await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.USP_RejectCancel,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();

        return result;
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

    public async Task<IEnumerable<LspTATData>> GetTATdata(Guid CustomerId, Guid? LspId, string? origin, string? destination)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerId", CustomerId, DbType.Guid);
        parameters.Add("@LspId", LspId, DbType.Guid);
        parameters.Add("@Origin", origin, DbType.String);
        parameters.Add("@Destination", destination, DbType.String);

        return await _dbConnection.QueryAsync<LspTATData>(
            StoredProcedureConstants.USP_CustomerTATRootDropdown,
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }
    public async Task<IEnumerable<DocketExcelUploadValidate>> GetValidateDocketImportData(string bulkDocket,Guid customerid)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@JsonData", bulkDocket, DbType.String);
        parameters.Add("@CustomerID", customerid, DbType.Guid);

        return await _dbConnection.QueryAsync<DocketExcelUploadValidate>(
            StoredProcedureConstants.USP_ValidateBulkUploadDocketData,
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }
    public async Task<CommonCreateResponse> InsertDocketData(string docketdata, Guid entryBy)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@json", docketdata, DbType.String);
        parameters.Add("@entryBy", entryBy, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
               StoredProcedureConstants.USP_InsertValiadateDocketData,
               param: parameters,
               commandType: CommandType.StoredProcedure
           ) ?? new CommonCreateResponse();
    }

    public async Task<IEnumerable<DocketStatusResponseData>> GetValidateDocketStatusUpdateData(string bulkDocket, Guid Lspid)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@JsonInput", bulkDocket, DbType.String);
        parameters.Add("@LspId", Lspid, DbType.Guid);

        return await _dbConnection.QueryAsync<DocketStatusResponseData>(
            StoredProcedureConstants.USP_ValidateDocketStatusData,
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }
    public async Task<CommonCreateResponse> UpdateDocketStatus(string docketstslist, Guid entryBy)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@JsonInput", docketstslist, DbType.String);
        parameters.Add("@EntryBy", entryBy, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
               StoredProcedureConstants.USP_UpdateDocketStatus,
               param: parameters,
               commandType: CommandType.StoredProcedure
           ) ?? new CommonCreateResponse();
    }
    public async Task<IEnumerable<ValidatePODResponse>> ValidatePODUplaodData(string jsonDocketData, string jsonImageNames, Guid lspuser)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@JsonDocketData", jsonDocketData, DbType.String);
        parameters.Add("@JsonImageNames", jsonImageNames, DbType.String);
        parameters.Add("@UserLSPId", lspuser, DbType.Guid);

        return await _dbConnection.QueryAsync<ValidatePODResponse>(
            StoredProcedureConstants.USP_ValidatePODJson,
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<CommonCreateResponse> ImportPOD(string podDataList, Guid User)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@JsonData", podDataList, DbType.String);
        parameters.Add("@UserName", User, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.PODUplaodDataFromExcel,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> SinglePODUploadFile(string docketNo, string docPod, Guid lspuser)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@DocketNo", docketNo, DbType.String);
        parameters.Add("@DocketJson", docPod, DbType.String);
        parameters.Add("@UserName", lspuser, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
              StoredProcedureConstants.USP_InsertUpdateSinglePODUpload,
              param: parameters,
              commandType: CommandType.StoredProcedure
          ) ?? new CommonCreateResponse();
    }
}