namespace Cygnux.LSP.Infrastructure.Contracts;

using Models.Response;
using Models.Response.LspMapping;

public interface ICustomerLspService
{
    Task<IEnumerable<LspMappingListResponse>> GetLspMappingList(Guid Id,string filters);

    Task<LspMappingDetailResponse> GetLspMappingDetails(Guid Id);

    Task<IEnumerable<LspTatDetailResponse>> GetLspTatList(Guid customerId, int page, int pageSize,Guid userId, string? customerName, string? lspName, string? product, string? origin, string? destination, int? tat,string? mmodeDescription);

    Task<IEnumerable<CustomerResponse>> GetCustomers(Guid loginid);

    Task<IEnumerable<LspResponse>> GetLsps(Guid login);

    Task<LspTatDetailResponse> GetLspTatDetails(Guid Id);

    Task<CommonCreateResponse> AddLspMapping(string addLspMappingJson);

    Task<CommonCreateResponse> UpdateLspMapping(Guid LspMapId, string updateLspMappingJson);
    Task<CommonCreateResponse> DeleteLspMapping(Guid Id);

    Task<CommonCreateResponse> AddCustomerLspTat(string addCustomerLspTatJson);

    Task<CommonCreateResponse> UpdateCustomerLspTat(string id, string updateCustomerLspTatJson);

    Task<CommonCreateResponse> DeleteLspMappingTat(Guid id);

    Task<IEnumerable<DeleteCutomerLSPData>> DeleteCustomerLspDetail(Guid Id);
    Task<IEnumerable<DeleteCustomerLspTatDetail>> DeleteCustomerLspTATDetail(Guid Id);
    Task<IEnumerable<LspMappingCount>> LspMappingCount(Guid userId);
    Task<IEnumerable<LspTatCount>> LspTatCount(Guid userId);
    Task<IEnumerable<LspTatDownloadResponse>> DownloadLspTat(Guid userId);
    Task<IEnumerable<DownloadLspMappingResponse>> DownloadLspMapping(Guid userId);

}