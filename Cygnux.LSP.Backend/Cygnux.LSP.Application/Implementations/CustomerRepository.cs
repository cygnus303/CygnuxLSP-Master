namespace Cygnux.LSP.Application.Implementations;

using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
using Identity.Contracts;
using Infrastructure.Constants;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Customer;
using Microsoft.AspNetCore.Identity;
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

    public async Task<BaseResponse<IEnumerable<CustomerListResponse>>> GetCustomerList(Guid userId, Dictionary<string, string> json)
    {
        var response = await _customerService.GetCustomerList(userId, JsonConvert.SerializeObject(json));
        return new BaseResponse<IEnumerable<CustomerListResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<CustomerDetailResponse?>> GetCustomerDetails(Guid custId, Guid userId)
    {
        var response = await _customerService.GetCustomerDetails(custId,userId);

        return new BaseResponse<CustomerDetailResponse?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddCustomer(CreateCustomerRequest createCustomerRequest)
    {
        var response = await _customerService.AddCustomer(JsonConvert.SerializeObject(createCustomerRequest));

        if (response.Status > 0)
        {

            //var identityResult = await _userRoleService.AddUserRole(Guid.Parse(createCustomerRequest.U_Id), createCustomerRequest.EmailId, CommonConstants.CustomerAdminRole);
            //if (!identityResult.Succeeded)
            //{
            //    return new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = identityResult.Errors.FirstOrDefault()?.Description });
            //}
            return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                 : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
        }
        else
        {
            return new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
        }
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateCustomer(string id, CreateCustomerRequest createCustomerRequest)
    {
        var response = await _customerService.UpdateCustomer(id, JsonConvert.SerializeObject(createCustomerRequest));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> DeleteCustomer(Guid id)
    {
        var response = await _customerService.DeleteCustomer(id);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
  
    public async Task<BaseResponse<IEnumerable<CustomerDeleteDataRes>>> DeleteCustomerData(Guid custId)
    {
        var response = await _customerService.DeleteCustomerData(custId);
        return new BaseResponse<IEnumerable<CustomerDeleteDataRes>>(response);
    }
    
    public async Task<BaseResponse<IEnumerable<CustomerCount>>> CustomerCount()
    {
        var response = await _customerService.CustomerCount();
        return new BaseResponse<IEnumerable<CustomerCount>>(response);
    }

    public async Task<BaseResponse<IEnumerable<CheckCustomerData>>> CheckCustomerData(Guid custId)
    {
        var response = await _customerService.CheckCustomerData(custId);
        return new BaseResponse<IEnumerable<CheckCustomerData>>(response);
    }
    public async Task<BaseResponse<IEnumerable<CustomerResponse>>> Customers(Guid userId)
    {
        var response = await _customerService.Customers(userId);
        return new BaseResponse<IEnumerable<CustomerResponse>>(response);
    }

}