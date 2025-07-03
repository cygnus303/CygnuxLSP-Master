namespace Cygnux.LSP.Infrastructure.Implementations;

using Azure;
using Constants;
using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.Customer;
using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
using Dapper;
using Models.Response;
using Models.Response.Lsp;
using System.Data;

internal class LspService : ILspService
{
    private readonly IDbConnection _dbConnection;

    public LspService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<LspListResponse>> GetLspList(Guid userId, string jsonreq)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@jsonreqst", jsonreq, DbType.String);

        return await _dbConnection.QueryAsync<LspListResponse>(
             StoredProcedureConstants.Usp_GetLsp_new,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<LspDetailResponse> GetLspDetails(Guid lspid)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@LspId", lspid, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<LspDetailResponse>(
            StoredProcedureConstants.USP_GetLspDetail,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new LspDetailResponse();
    }

    public async Task<CommonCreateResponse> AddLsp(string addLspJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@LspJson", addLspJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Lsp,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> UpdateLsp(Guid id, string updateLspJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@LspJson", updateLspJson, DbType.String);
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Lsp,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    //public async Task<CommonCreateResponse> DeleteLsp(Guid id)
    //{
    //    var deleteQuery = "Update Lsp Set IsDeleted = 1 Where LspId = @Id";
    //    var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
    //    if (rowAffected > 0)
    //    {
    //        return new CommonCreateResponse { Status = 1, Message = "Lsp deleted successfully" };
    //    }
    //    return new CommonCreateResponse();
    //}
    public async Task<CommonCreateResponse> DeleteLsp(Guid lspid)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@LSPID", lspid, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
              StoredProcedureConstants.USP_DeleteLSPAndUpdateRelations,
              param: parameters,
              commandType: CommandType.StoredProcedure
          ) ?? new CommonCreateResponse();
    }


    public async Task<DeleteLSPDataResponse> DeleteLSPDetails(Guid lspid)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@LSPID", lspid, DbType.Guid);

        var response = new DeleteLSPDataResponse();

        using var multi = await _dbConnection.QueryMultipleAsync(
            StoredProcedureConstants.USP_DeleteLSPData,
            param: parameters,
            commandType: CommandType.StoredProcedure
        );

        // Read results safely in expected order
        if (!multi.IsConsumed)
            response.CustomerMappings = (await multi.ReadAsync<CustomerLSPData>()).ToList();

        if (!multi.IsConsumed)
            response.TatDetails = (await multi.ReadAsync<CustomerLspTatData>()).ToList();

        if (!multi.IsConsumed)
            response.Dockets = (await multi.ReadAsync<LSPDocketData>()).ToList();

        if (!multi.IsConsumed)
        {
            var statusResult = await multi.ReadFirstOrDefaultAsync<StatusResult>();
            if (statusResult != null)
            {
                response.Status = statusResult.Status;
                response.Message = statusResult.Message;
            }
        }

        return response;
    }
    public async Task<IEnumerable<LSPCount>> LspCount()
    {
        return await _dbConnection.QueryAsync<LSPCount>(
             StoredProcedureConstants.Usp_LspCount,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<IEnumerable<LspResponse>> Lsps(Guid userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);

        return await _dbConnection.QueryAsync<LspResponse>(
             StoredProcedureConstants.Usp_GetLsps,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

}