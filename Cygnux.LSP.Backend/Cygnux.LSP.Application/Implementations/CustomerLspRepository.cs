namespace Cygnux.LSP.Application.Implementations;

using Azure;
using Contracts;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.LspMapping;
using Models.Request.CustomerLSPTAT;
using Models.Request.LspMapping;
using Models.Response;
using Newtonsoft.Json;

internal class CustomerLspRepository : ICustomerLspRepository
{
    private readonly ICustomerLspService _customerLspService;

    public CustomerLspRepository(ICustomerLspService customerLspService)
    {
        _customerLspService = customerLspService;
    }

    public async Task<BaseResponse<IEnumerable<LspTatDetailResponse>>> GetLspTatList(Guid customerId, int page, int pageSize)
    {
        var response = await _customerLspService.GetLspTatList(customerId, page, pageSize);
        return new BaseResponse<IEnumerable<LspTatDetailResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<IEnumerable<CustomerResponse>>> GetCustomers()
    {
        var response = await _customerLspService.GetCustomers();
        return new BaseResponse<IEnumerable<CustomerResponse>>(response);
    }

    public async Task<BaseResponse<IEnumerable<LspResponse>>> GetLsps()
    {
        var response = await _customerLspService.GetLsps();
        return new BaseResponse<IEnumerable<LspResponse>>(response);
    }

    public async Task<BaseResponse<LspTatDetailResponse?>> GetLspTatDetails(string mappingId)
    {
        var response = await _customerLspService.GetLspTatDetails(mappingId);
        return new BaseResponse<LspTatDetailResponse?>(response);
    }


    public async Task<BaseResponse<IEnumerable<LspMappingDetailResponse>>> GetLspMappingList(Guid customerId, int page, int pageSize)
    {
        var response = await _customerLspService.GetLspMappingList(customerId, page, pageSize);
        return new BaseResponse<IEnumerable<LspMappingDetailResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<LspMappingDetailResponse?>> GetLspMappingDetails(Guid customerId)
    {
        var response = await _customerLspService.GetLspMappingDetails(customerId);
        return new BaseResponse<LspMappingDetailResponse?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddLspMapping(CreateLspMappingRequest createLsp)
    {
        var response = await _customerLspService.AddLspMapping(JsonConvert.SerializeObject(createLsp));
        return new BaseResponse<CommonCreateResponse>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateLspMapping(Guid id, CreateLspMappingRequest createLspMapping)
    {
        var response = await _customerLspService.UpdateLspMapping(id, JsonConvert.SerializeObject(createLspMapping));
        return new BaseResponse<CommonCreateResponse>(response);
    }
    public async Task<BaseResponse<CommonCreateResponse>> DeleteLspMapping(Guid id)
    {
        var response = await _customerLspService.DeleteLspMapping(id);
        return new BaseResponse<CommonCreateResponse>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> DeleteLspMappingTat(Guid id)
    {
        var response = await _customerLspService.DeleteLspMappingTat(id);
        return new BaseResponse<CommonCreateResponse>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddCustomerLspTat(CreateCustomerLspTatRequest createCustomerLspTat)
    {
        var response = await _customerLspService.AddCustomerLspTat(JsonConvert.SerializeObject(createCustomerLspTat));
        return new BaseResponse<CommonCreateResponse>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateCustomerLspTat(string id, CreateCustomerLspTatRequest createCustomerLspTat)
    {
        var response = await _customerLspService.UpdateCustomerLspTat(id, JsonConvert.SerializeObject(createCustomerLspTat));
        return new BaseResponse<CommonCreateResponse>(response);
    }
}