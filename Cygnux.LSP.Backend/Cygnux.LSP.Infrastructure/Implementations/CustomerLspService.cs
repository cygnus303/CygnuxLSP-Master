namespace Cygnux.LSP.Infrastructure.Implementations;

using Constants;
using Contracts;
using Dapper;
using Models.Response;
using Models.Response.LspMapping;
using System.Data;

internal class CustomerLspService : ICustomerLspService
{
    private readonly IDbConnection _dbConnection;

    public CustomerLspService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<LspMappingListResponse>> GetLspMappingList(Guid id, string filters)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Guid);
        parameters.Add("@JsonData", filters, DbType.String);

        return await _dbConnection.QueryAsync<LspMappingListResponse>(
              StoredProcedureConstants.Usp_GetCustomerLsp_New,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }

    public async Task<LspMappingDetailResponse> GetLspMappingDetails(Guid Id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", Id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<LspMappingDetailResponse>(
             StoredProcedureConstants.USP_GetCustomerLSPDetails,
             param: parameters,
             commandType: CommandType.StoredProcedure
         ) ?? new LspMappingDetailResponse();
    }

    public async Task<IEnumerable<LspMappingCount>> LspMappingCount(Guid userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);

        return await _dbConnection.QueryAsync<LspMappingCount>(
             StoredProcedureConstants.Usp_LspMappingCount,
             param: parameters,
             commandType: CommandType.StoredProcedure
         );
    }
    public async Task<IEnumerable<CustomerResponse>> GetCustomers(Guid loginid)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@LoginId", loginid, DbType.Guid);

        return await _dbConnection.QueryAsync<CustomerResponse>(
              StoredProcedureConstants.Usp_GetMappedCustomer,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }
    public async Task<IEnumerable<LspResponse>> GetLsps(Guid login)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@LoginId", login, DbType.Guid);

        return await _dbConnection.QueryAsync<LspResponse>(
              StoredProcedureConstants.Usp_GetMappedLsp,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }
    public async Task<IEnumerable<LspTatDetailResponse>> GetLspTatList(Guid customerId, int page, int pageSize, Guid userId, string? customerName, string? lspName, string? product, string? origin, string? destination, int? tat,string? modeDescription)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Page", page, DbType.Int32);
        parameters.Add("@PageSize", pageSize, DbType.Int32);
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@CustomerName", customerName, DbType.String);
        parameters.Add("@LSPName", lspName, DbType.String);
        parameters.Add("@Product", product, DbType.String);
        parameters.Add("@Origin", origin, DbType.String);
        parameters.Add("@Destination", destination, DbType.String);
        parameters.Add("@Tat", tat, DbType.Int32);
        parameters.Add("@ModeDescription", modeDescription, DbType.String);

        return await _dbConnection.QueryAsync<LspTatDetailResponse>(
              StoredProcedureConstants.Usp_GetCustomerLspTat,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }

    public async Task<IEnumerable<LspTatDownloadResponse>> DownloadLspTat(Guid userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);

        return await _dbConnection.QueryAsync<LspTatDownloadResponse>(
              StoredProcedureConstants.Usp_DownloadLspTatLspTat,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }

    public async Task<LspTatDetailResponse> GetLspTatDetails(Guid Id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", Id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<LspTatDetailResponse>(
             StoredProcedureConstants.USP_GetCustomerLspTatDetails,
             param: parameters,
             commandType: CommandType.StoredProcedure
         ) ?? new LspTatDetailResponse();
    }

    public async Task<CommonCreateResponse> AddLspMapping(string addLspMappingJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerLspJson", addLspMappingJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
             StoredProcedureConstants.Usp_CustomerLsp,
             param: parameters,
             commandType: CommandType.StoredProcedure
         ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> UpdateLspMapping(Guid LspMapId, string updateLspMappingJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@LspMapId", LspMapId, DbType.Guid);
        parameters.Add("@CustomerLspJson", updateLspMappingJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
             StoredProcedureConstants.Usp_CustomerLsp,
             param: parameters,
             commandType: CommandType.StoredProcedure
         ) ?? new CommonCreateResponse();
    }

    //public async Task<CommonCreateResponse> DeleteLspMapping(Guid id)
    //{
    //    var deleteQuery = "Update CustomerLsp Set IsDeleted = 1 Where Id = @Id";
    //    var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
    //    if (rowAffected > 0)
    //    {
    //        return new CommonCreateResponse { Status = 1, Message = "Lsp mapping deleted successfully" };
    //    }
    //    return new CommonCreateResponse();
    //}

    public async Task<CommonCreateResponse> DeleteLspMapping(Guid Id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerLspId", Id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
              StoredProcedureConstants.USP_Delete_CustomerLsp_Relations,
              param: parameters,
              commandType: CommandType.StoredProcedure
          ) ?? new CommonCreateResponse();
    }

    //public async Task<CommonCreateResponse> DeleteLspMappingTat(Guid id)
    //{
    //    var deleteQuery = "Update CustomerLspTat Set IsDeleted = 1 Where Id = @Id";
    //    var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
    //    if (rowAffected > 0)
    //    {
    //        return new CommonCreateResponse { Status = 1, Message = "Lsp tat deleted successfully" };
    //    }
    //    return new CommonCreateResponse();
    //}

    public async Task<CommonCreateResponse> DeleteLspMappingTat(Guid Id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@TatId", Id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
              StoredProcedureConstants.USP_Delete_CustomerLspTat_And_Dockets,
              param: parameters,
              commandType: CommandType.StoredProcedure
          ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> AddCustomerLspTat(string addCustomerLspTatJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerLspTatJson", addCustomerLspTatJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
             StoredProcedureConstants.Usp_CustomerLspTat,
             param: parameters,
             commandType: CommandType.StoredProcedure
         ) ?? new CommonCreateResponse();
    }

    public async Task<IEnumerable<LspTatCount>> LspTatCount(Guid userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);

        return await _dbConnection.QueryAsync<LspTatCount>(
             StoredProcedureConstants.Usp_LspTatCount,
             param: parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<CommonCreateResponse> UpdateCustomerLspTat(string id, string updateCustomerLspTatJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerLspTatJson", updateCustomerLspTatJson, DbType.String);
        parameters.Add("@Id", id, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
             StoredProcedureConstants.Usp_CustomerLspTat,
             param: parameters,
             commandType: CommandType.StoredProcedure
         ) ?? new CommonCreateResponse();
    }

    public async Task<IEnumerable<DeleteCutomerLSPData>> DeleteCustomerLspDetail(Guid id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerLspId", id, DbType.Guid);

        return await _dbConnection.QueryAsync<DeleteCutomerLSPData>(
              StoredProcedureConstants.USP_Get_DeleteCustomerLspData,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }
    public async Task<IEnumerable<DeleteCustomerLspTatDetail>> DeleteCustomerLspTATDetail(Guid id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@TatId", id, DbType.Guid);

        return await _dbConnection.QueryAsync<DeleteCustomerLspTatDetail>(
              StoredProcedureConstants.USP_Get_CustomerLspTat_Details,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }

    public async Task<IEnumerable<DownloadLspMappingResponse>> DownloadLspMapping(Guid userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);

        return await _dbConnection.QueryAsync<DownloadLspMappingResponse>(
              StoredProcedureConstants.Usp_DownloadLspMapping,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }

    public async Task<IEnumerable<LspTatValidationResult>> GetTATdata(string bulkLspJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@JsonInput", bulkLspJson, DbType.String);

        return await _dbConnection.QueryAsync<LspTatValidationResult>(
            StoredProcedureConstants.USP_ValidateLspTatData,
            param: parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<CustomerLspTatSpResponse>> InsertLspTatData(string bulkLspJson, Guid entryBy)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerLspTatJson", bulkLspJson, DbType.String);
        parameters.Add("@EntryBy", entryBy, DbType.String);

        return await _dbConnection.QueryAsync<CustomerLspTatSpResponse>(
                    StoredProcedureConstants.Usp_BulkCustomerLspTat,
                    param: parameters,
                    commandType: CommandType.StoredProcedure
                );
    }
}