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

    public async Task<BaseResponse<IEnumerable<LspTatDetailResponse>>> GetLspTatList(Guid customerId, int page, int pageSize,Guid userId,string? customerName, string? lspName, string? product, string? origin, string? destination, int? tat,string? modeDescription)
    {
        var response = await _customerLspService.GetLspTatList(customerId, page, pageSize, userId,customerName,lspName,product,origin,destination,tat,modeDescription);
        return new BaseResponse<IEnumerable<LspTatDetailResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<IEnumerable<CustomerResponse>>> GetCustomers(Guid loginid)
    {
        var response = await _customerLspService.GetCustomers(loginid);
        return new BaseResponse<IEnumerable<CustomerResponse>>(response);
    }

    public async Task<BaseResponse<IEnumerable<LspResponse>>> GetLsps(Guid login)
    {
        var response = await _customerLspService.GetLsps(login);
        return new BaseResponse<IEnumerable<LspResponse>>(response);
    }

    public async Task<BaseResponse<LspTatDetailResponse?>> GetLspTatDetails(Guid Id)
    {
        var response = await _customerLspService.GetLspTatDetails(Id);
        return new BaseResponse<LspTatDetailResponse?>(response);
    }


    public async Task<BaseResponse<IEnumerable<LspMappingListResponse>>> GetLspMappingList(Guid Id, Dictionary<string, string> filters)
    {
        var response = await _customerLspService.GetLspMappingList(Id, JsonConvert.SerializeObject(filters));
        return new BaseResponse<IEnumerable<LspMappingListResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<LspMappingDetailResponse?>> GetLspMappingDetails(Guid Id)
    {
        var response = await _customerLspService.GetLspMappingDetails(Id);
        return new BaseResponse<LspMappingDetailResponse?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddLspMapping(CreateLspMappingRequest createLsp)
    {
        var response = await _customerLspService.AddLspMapping(JsonConvert.SerializeObject(createLsp));
        return new BaseResponse<CommonCreateResponse>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateLspMapping(Guid LspMapId, CreateLspMappingRequest createLspMapping)
    {
        var response = await _customerLspService.UpdateLspMapping(LspMapId, JsonConvert.SerializeObject(createLspMapping));
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