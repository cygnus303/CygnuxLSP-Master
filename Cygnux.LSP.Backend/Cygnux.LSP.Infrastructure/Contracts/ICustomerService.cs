namespace Cygnux.LSP.Infrastructure.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
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
    Task<IEnumerable<CheckCustomerData>> CheckCustomerData(Guid custId);
    Task<IEnumerable<CustomerResponse>> Customers(Guid userId);
    Task<IEnumerable<DownloadCustomerResponse>> DownloadCustomer(Guid userId);



}