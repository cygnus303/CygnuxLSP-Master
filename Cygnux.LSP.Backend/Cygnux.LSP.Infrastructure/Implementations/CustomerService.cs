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

    public async Task<IEnumerable<CustomerListResponse>> GetCustomerList(int page, int pageSize)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Page", page, DbType.Int32);
        parameters.Add("@PageSize", pageSize, DbType.Int32);

        return await _dbConnection.QueryAsync<CustomerListResponse>(
             StoredProcedureConstants.Usp_GetCustomer,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<CustomerDetailResponse> GetCustomerDetails(string customerCode)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@CustomerCode", customerCode, DbType.String);

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

    public async Task<CommonCreateResponse> DeleteCustomer(string id)
    {
        var deleteQuery = "Update Customer Set IsDeleted = 1 Where CustomerCode = @Id";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "Customer deleted successfully" };
        }
        return new CommonCreateResponse();
    }
}