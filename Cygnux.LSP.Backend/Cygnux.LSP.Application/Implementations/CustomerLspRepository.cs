namespace Cygnux.LSP.Application.Implementations;

using Azure;
using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
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

    public async Task<BaseResponse<IEnumerable<LspTatDetailResponse>>> GetLspTatList(Guid customerId, int page, int pageSize,Guid userId,string? customerName, string? lspName, string? product, string? origin, string? destination, int? tat)
    {
        var response = await _customerLspService.GetLspTatList(customerId, page, pageSize, userId,customerName,lspName,product,origin,destination,tat);
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

    public async Task<BaseResponse<LspTatDetailResponse?>> GetLspTatDetails(string mappingId, Guid userId)
    {
        var response = await _customerLspService.GetLspTatDetails(mappingId, userId);
        return new BaseResponse<LspTatDetailResponse?>(response);
    }


    public async Task<BaseResponse<IEnumerable<LspMappingDetailResponse>>> GetLspMappingList(Guid Id, Dictionary<string, string> filters)
    {
        var response = await _customerLspService.GetLspMappingList(Id, JsonConvert.SerializeObject(filters));
        return new BaseResponse<IEnumerable<LspMappingDetailResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<LspMappingDetailResponse?>> GetLspMappingDetails(Guid customerId, Guid userId)
    {
        var response = await _customerLspService.GetLspMappingDetails(customerId,userId);
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