namespace Cygnux.LSP.Application.Contracts;

using Infrastructure.Models.Response;
using Infrastructure.Models.Response.LspMapping;
using Models.Request.CustomerLSPTAT;
using Models.Request.LspMapping;
using Models.Response;

public interface ICustomerLspRepository
{
    Task<BaseResponse<IEnumerable<LspMappingDetailResponse>>> GetLspMappingList(Guid customerId, int page, int pageSize);

    Task<BaseResponse<LspMappingDetailResponse?>> GetLspMappingDetails(Guid customerId);

    Task<BaseResponse<IEnumerable<LspTatDetailResponse>>> GetLspTatList(Guid customerId, int page, int pageSize);

    Task<BaseResponse<IEnumerable<CustomerResponse>>> GetCustomers();

    Task<BaseResponse<IEnumerable<LspResponse>>> GetLsps();

    Task<BaseResponse<LspTatDetailResponse?>> GetLspTatDetails(string mappingId);

    Task<BaseResponse<CommonCreateResponse>> AddLspMapping(CreateLspMappingRequest createLsp);

    Task<BaseResponse<CommonCreateResponse>> DeleteLspMapping(Guid id);

    Task<BaseResponse<CommonCreateResponse>> UpdateLspMapping(Guid id, CreateLspMappingRequest createLspMapping);

    Task<BaseResponse<CommonCreateResponse>> AddCustomerLspTat(CreateCustomerLspTatRequest createCustomerLspTat);

    Task<BaseResponse<CommonCreateResponse>> UpdateCustomerLspTat(string id, CreateCustomerLspTatRequest createCustomerLspTat);

    Task<BaseResponse<CommonCreateResponse>> DeleteLspMappingTat(Guid id);
}