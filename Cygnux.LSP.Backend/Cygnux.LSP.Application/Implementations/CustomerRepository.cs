namespace Cygnux.LSP.Application.Implementations;

using Contracts;
using Identity.Contracts;
using Infrastructure.Constants;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Customer;
using Models.Request.Customer;
using Models.Response;
using Newtonsoft.Json;

internal class CustomerRepository : ICustomerRepository
{
    private readonly ICustomerService _customerService;
    private readonly IUserRoleService _userRoleService;

    public CustomerRepository(ICustomerService customerService,
        IUserRoleService userRoleService)
    {
        _customerService = customerService;
        _userRoleService = userRoleService;
    }

    public async Task<BaseResponse<IEnumerable<CustomerListResponse>>> GetCustomerList(int page, int pageSize)
    {
        var response = await _customerService.GetCustomerList(page, pageSize);
        return new BaseResponse<IEnumerable<CustomerListResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<CustomerDetailResponse?>> GetCustomerDetails(string customerCode)
    {
        var response = await _customerService.GetCustomerDetails(customerCode);

        return new BaseResponse<CustomerDetailResponse?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddCustomer(CreateCustomerRequest createCustomerRequest)
    {
        var response = await _customerService.AddCustomer(JsonConvert.SerializeObject(createCustomerRequest));

        if (response.Status > 0)
        {
            var identityResult = await _userRoleService.AddUserRole(Guid.NewGuid(), createCustomerRequest.EmailId, CommonConstants.CustomerAdminRole);
            if (!identityResult.Succeeded)
            {
                return new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = identityResult.Errors.FirstOrDefault()?.Description });
            }
        }

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateCustomer(string id, CreateCustomerRequest createCustomerRequest)
    {
        var response = await _customerService.UpdateCustomer(id, JsonConvert.SerializeObject(createCustomerRequest));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> DeleteCustomer(string id)
    {
        var response = await _customerService.DeleteCustomer(id);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
}