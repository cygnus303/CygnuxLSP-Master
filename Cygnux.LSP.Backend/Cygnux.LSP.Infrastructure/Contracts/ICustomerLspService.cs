namespace Cygnux.LSP.Infrastructure.Contracts;

using Models.Response;
using Models.Response.LspMapping;

public interface ICustomerLspService
{
    Task<IEnumerable<LspMappingDetailResponse>> GetLspMappingList(Guid customerId, int page, int pageSize);

    Task<LspMappingDetailResponse> GetLspMappingDetails(Guid customerId);

    Task<IEnumerable<LspTatDetailResponse>> GetLspTatList(Guid customerId, int page, int pageSize);

    Task<IEnumerable<CustomerResponse>> GetCustomers();

    Task<IEnumerable<LspResponse>> GetLsps();

    Task<LspTatDetailResponse> GetLspTatDetails(string mappingId);

    Task<CommonCreateResponse> AddLspMapping(string addLspMappingJson);

    Task<CommonCreateResponse> UpdateLspMapping(Guid id, string updateLspMappingJson);
    Task<CommonCreateResponse> DeleteLspMapping(Guid id);


    Task<CommonCreateResponse> AddCustomerLspTat(string addCustomerLspTatJson);

    Task<CommonCreateResponse> UpdateCustomerLspTat(string id, string updateCustomerLspTatJson);

    Task<CommonCreateResponse> DeleteLspMappingTat(Guid id);
}