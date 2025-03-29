namespace Cygnux.LSP.Application.Contracts;

using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Customer;
using Models.Request.Customer;
using Models.Response;

public interface ICustomerRepository
{
    Task<BaseResponse<IEnumerable<CustomerListResponse>>> GetCustomerList(string? customerCode, int page, int pageSize, Guid userId, string? CustomerName, string? EmailId);

    Task<BaseResponse<CustomerDetailResponse?>> GetCustomerDetails(string customerCode, Guid userId);

    Task<BaseResponse<CommonCreateResponse>> AddCustomer(CreateCustomerRequest createCustomerRequest);

    Task<BaseResponse<CommonCreateResponse>> UpdateCustomer(string id, CreateCustomerRequest createCustomerRequest);

    Task<BaseResponse<CommonCreateResponse>> DeleteCustomer(string id);
}