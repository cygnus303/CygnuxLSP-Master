namespace Cygnux.LSP.Infrastructure.Contracts;

using Models.Response;
using Models.Response.Customer;

public interface ICustomerService
{
    Task<IEnumerable<CustomerListResponse>> GetCustomerList(Guid userId,string json);

    Task<CustomerDetailResponse> GetCustomerDetails(Guid custId, Guid userId);

    Task<CommonCreateResponse> AddCustomer(string addCustomerJson);

    Task<CommonCreateResponse> UpdateCustomer(string id, string updateCustomerJson);

    Task<CommonCreateResponse> DeleteCustomer(Guid id);
    Task<IEnumerable<CustomerDeleteDataRes>> DeleteCustomerData(Guid custId);
    Task<IEnumerable<CustomerCount>> CustomerCount();
    Task<IEnumerable<CustomerDeleteDataRes>> CheckCustomerData(Guid custId);

}