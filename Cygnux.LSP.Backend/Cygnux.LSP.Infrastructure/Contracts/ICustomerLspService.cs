namespace Cygnux.LSP.Infrastructure.Contracts;

using Models.Response;
using Models.Response.LspMapping;

public interface ICustomerLspService
{
    Task<IEnumerable<LspMappingListResponse>> GetLspMappingList(Guid Id,string filters);

    Task<LspMappingDetailResponse> GetLspMappingDetails(Guid Id);

    Task<IEnumerable<LspTatDetailResponse>> GetLspTatList(Guid customerId, int page, int pageSize,Guid userId, string? customerName, string? lspName, string? product, string? origin, string? destination, int? tat);

    Task<IEnumerable<CustomerResponse>> GetCustomers(Guid loginid);

    Task<IEnumerable<LspResponse>> GetLsps(Guid login);

    Task<LspTatDetailResponse> GetLspTatDetails(string mappingId, Guid userId);

    Task<CommonCreateResponse> AddLspMapping(string addLspMappingJson);

    Task<CommonCreateResponse> UpdateLspMapping(Guid LspMapId, string updateLspMappingJson);
    Task<CommonCreateResponse> DeleteLspMapping(Guid id);


    Task<CommonCreateResponse> AddCustomerLspTat(string addCustomerLspTatJson);

    Task<CommonCreateResponse> UpdateCustomerLspTat(string id, string updateCustomerLspTatJson);

    Task<CommonCreateResponse> DeleteLspMappingTat(Guid id);
}