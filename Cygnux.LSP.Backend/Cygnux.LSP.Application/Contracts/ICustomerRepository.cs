namespace Cygnux.LSP.Application.Contracts;

using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Customer;
using Models.Request.Customer;
using Models.Response;

public interface ICustomerRepository
{
    Task<BaseResponse<IEnumerable<CustomerListResponse>>> GetCustomerList(int page, int pageSize);

    Task<BaseResponse<CustomerDetailResponse?>> GetCustomerDetails(string customerCode);

    Task<BaseResponse<CommonCreateResponse>> AddCustomer(CreateCustomerRequest createCustomerRequest);

    Task<BaseResponse<CommonCreateResponse>> UpdateCustomer(string id, CreateCustomerRequest createCustomerRequest);

    Task<BaseResponse<CommonCreateResponse>> DeleteCustomer(string id);
}