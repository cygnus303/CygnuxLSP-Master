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

    Task<BaseResponse<IEnumerable<LspTatDetailResponse>>> GetLspTatList(Guid customerId, int page, int pageSize,Guid userId, string? customerName, string? lspName, string? product, string? origin, string? destination, int? tat,string? modeDescription,decimal? RatePerKg);

    Task<BaseResponse<IEnumerable<CustomerResponse>>> GetCustomers(Guid loginid);

    Task<BaseResponse<IEnumerable<LspResponse>>> GetLsps(Guid login);

    Task<BaseResponse<LspTatDetailResponse?>> GetLspTatDetails(Guid Id);

    Task<BaseResponse<CommonCreateResponse>> AddLspMapping(CreateLspMappingRequest createLsp);

    Task<BaseResponse<CommonCreateResponse>> DeleteLspMapping(Guid Id);

    Task<BaseResponse<CommonCreateResponse>> UpdateLspMapping(Guid LspMapId, CreateLspMappingRequest createLspMapping);

    Task<BaseResponse<CommonCreateResponse>> AddCustomerLspTat(CreateCustomerLspTatRequest createCustomerLspTat);

    Task<BaseResponse<CommonCreateResponse>> UpdateCustomerLspTat(string id, CreateCustomerLspTatRequest createCustomerLspTat);

    Task<BaseResponse<CommonCreateResponse>> DeleteLspMappingTat(Guid id);
    Task<BaseResponse<IEnumerable<DeleteCutomerLSPData>>> DeleteCustomerLspDetail(Guid Id);
    Task<BaseResponse<IEnumerable<DeleteCustomerLspTatDetail>>> DeleteCustomerLspTATDetail(Guid Id);
    Task<BaseResponse<IEnumerable<LspMappingCount>>> LspMappingCount(Guid userId);
    Task<BaseResponse<IEnumerable<LspTatCount>>> LspTatCount(Guid userId);
    Task<BaseResponse<IEnumerable<LspTatDownloadResponse>>> DownloadLspTat(Guid userId);
    Task<BaseResponse<IEnumerable<DownloadLspMappingResponse>>> DownloadLspMapping(Guid userId);

    Task<BaseResponse<IEnumerable<LspTatValidationResult>>> GetTATdata(List<Dictionary<string, string>> BulkLsp, Guid entryBy);
    Task<BaseResponse<CustomerLspTatSpResponse>> InsertLspTatData(List<CustomerLspTatRequest> lsptatlist, Guid entryBy);
    Task<BaseResponse<UserRoleResponse>> GetUserRolesById(Guid customerId);

}