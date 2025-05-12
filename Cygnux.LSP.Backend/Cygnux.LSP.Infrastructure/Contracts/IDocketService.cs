namespace Cygnux.LSP.Infrastructure.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
using Models.Response;
using Models.Response.Docket;

public interface IDocketService
{
    Task<IEnumerable<DocketListResponse>> GetDocketList(Guid userId, string reqFilter);
    Task<DocketDetailResponse> GetDocketDetails(Guid docketId);
    Task<CommonCreateResponse> ImportDocket(string addDocketsJson);
    Task<IEnumerable<TrackingList>> GetTrackingList(string codetype);
    Task<IEnumerable<DocList>> GetDocketData(string docketno);
    Task<CommonCreateResponse> AddDocket(string addDocketJson);
    Task<CommonCreateResponse> UpdateDocket(Guid id, string updateDocketJson);
    Task<CommonCreateResponse> DeleteDocket(Guid id);
    Task<IEnumerable<LspTATData>> GetTATdata(Guid CustomerId, string? origin, string? destination);
    Task<IEnumerable<DocketBulkUploadValidateResponse>> GetValidateDocketImportData(string bulkDocket, Guid customerid);
    Task<CommonCreateResponse> InsertDocketData(string docketdata, Guid entryBy);
    Task<CommonCreateResponse> ImportPOD(string PodData,Guid User);
    Task<IEnumerable<DocketStatusResponseData>> GetValidateDocketStatusUpdateData(string bulkDocket, Guid custId);
    Task<CommonCreateResponse> UpdateDocketStatus(string docketstslist, Guid entryBy);
}