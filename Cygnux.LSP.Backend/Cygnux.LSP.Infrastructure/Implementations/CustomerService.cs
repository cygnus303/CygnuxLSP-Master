namespace Cygnux.LSP.Infrastructure.Implementations;

using Constants;
using Contracts;
using Dapper;
using Models.Response;
using Models.Response.Customer;
using System.Data;

internal class CustomerService : ICustomerService
{
    private readonly IDbConnection _dbConnection;

    public CustomerService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<CustomerListResponse>> GetCustomerList(string? customerCode,int page, int pageSize, Guid userId,string? CustomerName,string? EmailId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerCode", customerCode, DbType.String);
        parameters.Add("@Page", page, DbType.Int32);
        parameters.Add("@PageSize", pageSize, DbType.Int32);
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@CustomerName", CustomerName, DbType.String);
        parameters.Add("@EmailId", EmailId, DbType.String);

        return await _dbConnection.QueryAsync<CustomerListResponse>(
             StoredProcedureConstants.Usp_GetCustomer,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<CustomerDetailResponse> GetCustomerDetails(string customerCode, Guid userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerCode", customerCode, DbType.String);
        parameters.Add("@UserId", userId, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CustomerDetailResponse>(
            StoredProcedureConstants.Usp_GetCustomer,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CustomerDetailResponse();
    }

    public async Task<CommonCreateResponse> AddCustomer(string addCustomerJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerJson", addCustomerJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Customer,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> UpdateCustomer(string id, string updateCustomerJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerJson", updateCustomerJson, DbType.String);
        parameters.Add("@Id", id, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
              StoredProcedureConstants.Usp_Customer,
              param: parameters,
              commandType: CommandType.StoredProcedure
          ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> DeleteCustomer(Guid id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerId", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
              StoredProcedureConstants.USP_CustomerDelete,
              param: parameters,
              commandType: CommandType.StoredProcedure
          ) ?? new CommonCreateResponse();
    }

    public async Task<IEnumerable<CustomerDeleteDataRes>> DeleteCustomerData(Guid custId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerId", custId, DbType.Guid);

        return await _dbConnection.QueryAsync<CustomerDeleteDataRes>(
             StoredProcedureConstants.USP_DeleteCustomerDetails,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }
}