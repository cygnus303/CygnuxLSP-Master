namespace Cygnux.LSP.Infrastructure.Implementations;

using Constants;
using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
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

    public async Task<IEnumerable<CustomerListResponse>> GetCustomerList(Guid userId, string json)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@jsoninput", json, DbType.String);

        return await _dbConnection.QueryAsync<CustomerListResponse>(
             StoredProcedureConstants.Usp_GetCustomer_new,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<CustomerDetailResponse> GetCustomerDetails(Guid custId, Guid userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerId", custId, DbType.Guid);
        parameters.Add("@UserId", userId, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CustomerDetailResponse>(
            StoredProcedureConstants.Usp_GetCustomer_new,
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
    
    public async Task<IEnumerable<CustomerCount>> CustomerCount()
    {
        return await _dbConnection.QueryAsync<CustomerCount>(
             StoredProcedureConstants.Usp_CustomerCount,
             commandType: CommandType.StoredProcedure
         );
    }
    public async Task<IEnumerable<CheckCustomerData>> CheckCustomerData(Guid custId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerId", custId, DbType.Guid);

        return await _dbConnection.QueryAsync<CheckCustomerData>(
             StoredProcedureConstants.USP_CheckCustomerDetail,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<IEnumerable<CustomerResponse>> Customers(Guid userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);

        return await _dbConnection.QueryAsync<CustomerResponse>(
             StoredProcedureConstants.Usp_GetCustomers,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

}