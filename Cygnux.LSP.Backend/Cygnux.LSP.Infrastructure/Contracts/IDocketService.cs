namespace Cygnux.LSP.Infrastructure.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
using Models.Response;
using Models.Response.Docket;

public interface IDocketService
{
    Task<IEnumerable<DocketListResponse>> GetDocketList(int page, int pageSize, Guid userId, string? docketNo, string? fromLocation, string? toLocation, int? quantity);

    Task<DocketDetailResponse> GetDocketDetails(Guid docketId, Guid userId);
    Task<CommonCreateResponse> ImportDocket(string addDocketsJson);
    Task<IEnumerable<TrackingList>> GetTrackingList(string codetype);
    Task<CommonCreateResponse> AddDocket(string addDocketJson);

    Task<CommonCreateResponse> UpdateDocket(Guid id, string updateDocketJson);

    Task<CommonCreateResponse> DeleteDocket(Guid id);
    Task<IEnumerable<LspTATData>> GetTATdata(Guid CustomerId, string? origin, string? destination);
    Task<IEnumerable<DocketBulkUploadValidateResponse>> GetValidateDocketImportData(string bulkDocket, string customerid);

    Task<CommonCreateResponse> ImportPOD(string PodData,Guid User);
}