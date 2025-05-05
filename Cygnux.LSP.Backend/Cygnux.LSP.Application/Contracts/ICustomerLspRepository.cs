namespace Cygnux.LSP.Application.Contracts;

using Infrastructure.Models.Response;
using Infrastructure.Models.Response.LspMapping;
using Models.Request.CustomerLSPTAT;
using Models.Request.LspMapping;
using Models.Response;

public interface ICustomerLspRepository
{
    Task<BaseResponse<IEnumerable<LspMappingListResponse>>> GetLspMappingList(Guid Id,Dictionary<string, string> filters);

    Task<BaseResponse<LspMappingDetailResponse?>> GetLspMappingDetails(Guid Id);

    Task<BaseResponse<IEnumerable<LspTatDetailResponse>>> GetLspTatList(Guid customerId, int page, int pageSize,Guid userId, string? customerName, string? lspName, string? product, string? origin, string? destination, int? tat);

    Task<BaseResponse<IEnumerable<CustomerResponse>>> GetCustomers(Guid loginid);

    Task<BaseResponse<IEnumerable<LspResponse>>> GetLsps(Guid login);

    Task<BaseResponse<LspTatDetailResponse?>> GetLspTatDetails(string mappingId,Guid userId);

    Task<BaseResponse<CommonCreateResponse>> AddLspMapping(CreateLspMappingRequest createLsp);

    Task<BaseResponse<CommonCreateResponse>> DeleteLspMapping(Guid id);

    Task<BaseResponse<CommonCreateResponse>> UpdateLspMapping(Guid LspMapId, CreateLspMappingRequest createLspMapping);

    Task<BaseResponse<CommonCreateResponse>> AddCustomerLspTat(CreateCustomerLspTatRequest createCustomerLspTat);

    Task<BaseResponse<CommonCreateResponse>> UpdateCustomerLspTat(string id, CreateCustomerLspTatRequest createCustomerLspTat);

    Task<BaseResponse<CommonCreateResponse>> DeleteLspMappingTat(Guid id);
}