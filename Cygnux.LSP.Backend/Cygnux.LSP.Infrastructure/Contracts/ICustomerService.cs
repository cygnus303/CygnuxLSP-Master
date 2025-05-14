namespace Cygnux.LSP.Infrastructure.Contracts;

using Models.Response;
using Models.Response.Customer;

public interface ICustomerService
{
    Task<IEnumerable<CustomerListResponse>> GetCustomerList(string? customerCode,int page, int pageSize, Guid userId,string? CustomerName,string? EmailId);

    Task<CustomerDetailResponse> GetCustomerDetails(string customerCode,Guid userId);

    Task<CommonCreateResponse> AddCustomer(string addCustomerJson);

    Task<CommonCreateResponse> UpdateCustomer(string id, string updateCustomerJson);

    Task<CommonCreateResponse> DeleteCustomer(Guid id);
}