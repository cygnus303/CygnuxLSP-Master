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

    public async Task<IEnumerable<LspMappingDetailResponse>> GetLspMappingList(Guid customerId, int page, int pageSize)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Page", page, DbType.Int32);
        parameters.Add("@PageSize", pageSize, DbType.Int32);

        return await _dbConnection.QueryAsync<LspMappingDetailResponse>(
              StoredProcedureConstants.Usp_GetCustomerLsp,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }

    public async Task<LspMappingDetailResponse> GetLspMappingDetails(Guid customerId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerId", customerId, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<LspMappingDetailResponse>(
             StoredProcedureConstants.Usp_GetCustomerLsp,
             param: parameters,
             commandType: CommandType.StoredProcedure
         ) ?? new LspMappingDetailResponse();
    }
    public async Task<IEnumerable<CustomerResponse>> GetCustomers()
    {
        var parameters = new DynamicParameters();

        return await _dbConnection.QueryAsync<CustomerResponse>(
              StoredProcedureConstants.Usp_GetMappedCustomer,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }
    public async Task<IEnumerable<LspResponse>> GetLsps()
    {
        var parameters = new DynamicParameters();

        return await _dbConnection.QueryAsync<LspResponse>(
              StoredProcedureConstants.Usp_GetMappedLsp,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }
    public async Task<IEnumerable<LspTatDetailResponse>> GetLspTatList(Guid customerId, int page, int pageSize)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Page", page, DbType.Int32);
        parameters.Add("@PageSize", pageSize, DbType.Int32);

        return await _dbConnection.QueryAsync<LspTatDetailResponse>(
              StoredProcedureConstants.Usp_GetCustomerLspTat,
              param: parameters,
              commandType: CommandType.StoredProcedure
          );
    }

    public async Task<LspTatDetailResponse> GetLspTatDetails(string mappingId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", mappingId, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<LspTatDetailResponse>(
             StoredProcedureConstants.Usp_GetCustomerLspTat,
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

    public async Task<CommonCreateResponse> UpdateLspMapping(Guid id, string updateLspMappingJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerLspJson", updateLspMappingJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
             StoredProcedureConstants.Usp_CustomerLsp,
             param: parameters,
             commandType: CommandType.StoredProcedure
         ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> DeleteLspMapping(Guid id)
    {
        var deleteQuery = "Update CustomerLsp Set IsDeleted = 1 Where CustomerId = @Id";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "Lsp mapping deleted successfully" };
        }
        return new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> DeleteLspMappingTat(Guid id)
    {
        var deleteQuery = "Update CustomerLspTat Set IsDeleted = 1 Where Id = @Id";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "Lsp tat deleted successfully" };
        }
        return new CommonCreateResponse();
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
}