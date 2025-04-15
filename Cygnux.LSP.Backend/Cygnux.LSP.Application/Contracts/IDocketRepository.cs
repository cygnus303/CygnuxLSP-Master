namespace Cygnux.LSP.Application.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Docket;
using Models.Request.Docket;
using Models.Response;

public interface IDocketRepository
{
    Task<BaseResponse<IEnumerable<DocketListResponse>>> GetDocketList(int page, int pageSize, Guid userId, string? docketNo, string? fromLocation, string? toLocation, int? quantity);

    Task<BaseResponse<DocketDetailResponse?>> GetDocketDetails(Guid docketId,Guid userId);

    Task<BaseResponse<CommonCreateResponse>> ImportDocket(List<Dictionary<string, string>> createDockets);
    Task<BaseResponse<IEnumerable<TrackingList>>> GetTrackingList(string codetype);
    Task<BaseResponse<CommonCreateResponse>> AddDocket(CreateDocketRequest createDocketRequest);

    Task<BaseResponse<CommonCreateResponse>> UpdateDocket(Guid docketId, CreateDocketRequest createDocketRequest);

    Task<BaseResponse<CommonCreateResponse>> DeleteDocket(Guid docketId);
    Task<BaseResponse<IEnumerable<LspTATData>>> GetTATdata(Guid CustomerId, string? origin, string? destination);
    Task<BaseResponse<IEnumerable<DocketBulkUploadValidateResponse>>> GetValidateDocketImportData(List<Dictionary<string, string>> bulkDocket, string customerid);
    Task<BaseResponse<CommonCreateResponse>> ImportPOD(List<PODDataList> PodData, Guid User);
}