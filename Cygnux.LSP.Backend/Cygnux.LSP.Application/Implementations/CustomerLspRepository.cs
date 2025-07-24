namespace Cygnux.LSP.Application.Implementations;

using Azure;
using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Cygnux.LSP.Infrastructure.Models.Response.Lsp;
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

    public async Task<BaseResponse<IEnumerable<LspTatDownloadResponse>>> DownloadLspTat(Guid userId)
    {
        var response = await _customerLspService.DownloadLspTat(userId);
        return new BaseResponse<IEnumerable<LspTatDownloadResponse>>(response);
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
    public async Task<BaseResponse<IEnumerable<LspMappingCount>>> LspMappingCount(Guid userId)
    {
        var response = await _customerLspService.LspMappingCount(userId);
        return new BaseResponse<IEnumerable<LspMappingCount>>(response);
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
    public async Task<BaseResponse<CommonCreateResponse>> DeleteLspMapping(Guid Id)
    {
        var response = await _customerLspService.DeleteLspMapping(Id);
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

    public async Task<BaseResponse<IEnumerable<LspTatCount>>> LspTatCount(Guid userId)
    {
        var response = await _customerLspService.LspTatCount(userId);
        return new BaseResponse<IEnumerable<LspTatCount>>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateCustomerLspTat(string id, CreateCustomerLspTatRequest createCustomerLspTat)
    {
        var response = await _customerLspService.UpdateCustomerLspTat(id, JsonConvert.SerializeObject(createCustomerLspTat));
        return new BaseResponse<CommonCreateResponse>(response);
    }
    public async Task<BaseResponse<IEnumerable<DeleteCutomerLSPData>>> DeleteCustomerLspDetail(Guid Id)
    {
        var response = await _customerLspService.DeleteCustomerLspDetail(Id);
        return new BaseResponse<IEnumerable<DeleteCutomerLSPData>>(response);
    }
    public async Task<BaseResponse<IEnumerable<DeleteCustomerLspTatDetail>>> DeleteCustomerLspTATDetail(Guid Id)
    {
        var response = await _customerLspService.DeleteCustomerLspTATDetail(Id);
        return new BaseResponse<IEnumerable<DeleteCustomerLspTatDetail>>(response);
    }

    public async Task<BaseResponse<IEnumerable<DownloadLspMappingResponse>>> DownloadLspMapping(Guid userId)
    {
        var response = await _customerLspService.DownloadLspMapping(userId);
        return new BaseResponse<IEnumerable<DownloadLspMappingResponse>>(response);
    }

    public async Task<BaseResponse<IEnumerable<LspTatValidationResult>>> GetTATdata(List<Dictionary<string, string>> BulkLsp, Guid entryBy)
    {
        var response = await _customerLspService.GetTATdata(JsonConvert.SerializeObject(BulkLsp),entryBy);
        return new BaseResponse<IEnumerable<LspTatValidationResult>>(response);
    }

    public async Task<BaseResponse<CustomerLspTatSpResponse>> InsertLspTatData(List<CustomerLspTatRequest> lsptatlist, Guid entryBy)
    {
        var response = await _customerLspService.InsertLspTatData(JsonConvert.SerializeObject(lsptatlist), entryBy);
        return new BaseResponse<CustomerLspTatSpResponse>(response);
    }

    public async Task<BaseResponse<UserRoleResponse>> GetUserRolesById(Guid customerId)
    {
        var response = await _customerLspService.GetUserRolesById(customerId);
        return new BaseResponse<UserRoleResponse>(response);
    }
}