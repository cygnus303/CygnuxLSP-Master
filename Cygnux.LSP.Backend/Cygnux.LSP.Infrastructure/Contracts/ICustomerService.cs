namespace Cygnux.LSP.Infrastructure.Contracts;

using Models.Response;
using Models.Response.Customer;

public interface ICustomerService
{
    Task<IEnumerable<CustomerListResponse>> GetCustomerList(int page, int pageSize);

    Task<CustomerDetailResponse> GetCustomerDetails(string customerCode);

    Task<CommonCreateResponse> AddCustomer(string addCustomerJson);

    Task<CommonCreateResponse> UpdateCustomer(string id, string updateCustomerJson);

    Task<CommonCreateResponse> DeleteCustomer(string id);
}