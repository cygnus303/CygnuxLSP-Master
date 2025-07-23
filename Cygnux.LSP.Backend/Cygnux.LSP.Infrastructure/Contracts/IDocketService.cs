namespace Cygnux.LSP.Infrastructure.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
using Models.Response;
using Models.Response.Docket;

public interface IDocketService
{
    Task<IEnumerable<DocketListResponse>> GetDocketList(Guid userId, string reqFilter);
    Task<DocketDetailResponse> GetDocketDetails(Guid docketId);
    Task<IEnumerable<City_Master>> GetCityData_Docket(string SearchTerms);
    Task<IEnumerable<City_Master>> GetCityData(string stcd);
    Task<IEnumerable<State_Master>> GetStateData(string SearchTerm);
    Task<CommonCreateResponse> ImportDocket(string addDocketsJson);
    Task<IEnumerable<TrackingList>> GetTrackingList(string codetype);
    Task<IEnumerable<TrackingList>> TransportmodeList(string codetype,Guid CustomerId);
    Task<IEnumerable<DocList>> GetDocketData(string docketno);
    Task<CommonCreateResponse> AddDocket(string addDocketJson);
    Task<CommonCreateResponse> UpdateDocket(Guid id, string updateDocketJson);
    Task<CommonCreateResponse> SingleDocketStsUpdate(Guid DocketId, string docksts, Guid user);
    Task<CommonCreateResponse> DeleteDocket(Guid id);
    Task<CommonCreateResponse> DocketCancel(Guid id, Guid userId);
    Task<CommonCreateResponse> DocketReject(Guid id, Guid userId, string? remarks);
    Task<IEnumerable<LspTATData>> GetTATdata(Guid CustomerId, Guid? LspId, string? origin, string? destination);
    Task<IEnumerable<LspTATData_Docket>> GetLSPForDocket(string DocketNo, DateTime BookingDate, string TransportMode, decimal TotalKg, string FromWH, string ToWH);
    Task<IEnumerable<DocketExcelUploadValidate>> GetValidateDocketImportData(string bulkDocket, Guid customerid);
    Task<CommonCreateResponse> InsertDocketData(string docketdata, Guid entryBy);
    Task<CommonCreateResponse> ImportPOD(string podDataList, Guid User);
    Task<IEnumerable<DocketStatusResponseData>> GetValidateDocketStatusUpdateData(string bulkDocket, Guid Lspid);
    Task<CommonCreateResponse> UpdateDocketStatus(string docketstslist, Guid entryBy);
    Task<IEnumerable<ValidatePODResponse>> ValidatePODUplaodData(string jsonDocketData, string jsonImageNames, Guid lspuser);
    Task<CommonCreateResponse> SinglePODUploadFile(string docketNo,string docPod, Guid lspuser);
    Task<IEnumerable<DownloadDocketResponse>> DownloadDocket(Guid userId);
}