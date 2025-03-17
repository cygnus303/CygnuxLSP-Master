namespace Cygnux.LSP.Application.Contracts;

using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Docket;
using Models.Request.Docket;
using Models.Response;

public interface IDocketRepository
{
    Task<BaseResponse<IEnumerable<DocketListResponse>>> GetDocketList(int page, int pageSize);

    Task<BaseResponse<DocketDetailResponse?>> GetDocketDetails(Guid docketId);

    Task<BaseResponse<CommonCreateResponse>> ImportDocket(List<Dictionary<string, string>> createDockets);
    Task<BaseResponse<CommonCreateResponse>> AddDocket(CreateDocketRequest createDocketRequest);

    Task<BaseResponse<CommonCreateResponse>> UpdateDocket(Guid docketId, CreateDocketRequest createDocketRequest);

    Task<BaseResponse<CommonCreateResponse>> DeleteDocket(Guid docketId);
}