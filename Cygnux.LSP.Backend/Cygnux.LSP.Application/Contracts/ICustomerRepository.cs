namespace Cygnux.LSP.Application.Contracts;

using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Customer;
using Models.Request.Customer;
using Models.Response;

public interface ICustomerRepository
{
    Task<BaseResponse<IEnumerable<CustomerListResponse>>> GetCustomerList(Guid userId, Dictionary<string, string> json);

    Task<BaseResponse<CustomerDetailResponse?>> GetCustomerDetails(Guid custId, Guid userId);

    Task<BaseResponse<CommonCreateResponse>> AddCustomer(CreateCustomerRequest createCustomerRequest);

    Task<BaseResponse<CommonCreateResponse>> UpdateCustomer(string id, CreateCustomerRequest createCustomerRequest);

    Task<BaseResponse<CommonCreateResponse>> DeleteCustomer(Guid id);
    Task<BaseResponse<IEnumerable<CustomerDeleteDataRes>>> DeleteCustomerData(Guid custId);
    Task<BaseResponse<IEnumerable<CustomerCount>>> CustomerCount();
}