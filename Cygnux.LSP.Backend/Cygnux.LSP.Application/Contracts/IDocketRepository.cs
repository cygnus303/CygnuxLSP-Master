namespace Cygnux.LSP.Application.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Docket;
using Models.Request.Docket;
using Models.Response;

public interface IDocketRepository
{
    Task<BaseResponse<IEnumerable<DocketListResponse>>> GetDocketList(Guid userId, Dictionary<string, string> reqFilter);

    Task<BaseResponse<DocketDetailResponse?>> GetDocketDetails(Guid docketId);
    Task<BaseResponse<IEnumerable<City_Master>>> GetCityData(string SearchTerm);
    Task<BaseResponse<IEnumerable<State_Master>>> GetStateData(string SearchTerm);

    Task<BaseResponse<CommonCreateResponse>> ImportDocket(List<Dictionary<string, string>> createDockets);
    Task<BaseResponse<IEnumerable<TrackingList>>> GetTrackingList(string codetype);
    Task<BaseResponse<IEnumerable<DocList>>> GetDocketData(string docketno);
    Task<BaseResponse<CommonCreateResponse>> AddDocket(CreateDocketRequest createDocketRequest);

    Task<BaseResponse<CommonCreateResponse>> UpdateDocket(Guid docketId, CreateDocketRequest createDocketRequest);
    Task<BaseResponse<CommonCreateResponse>> SingleDocketStsUpdate(Guid DocketId, DocketStatusReq docksts, Guid user);
    Task<BaseResponse<CommonCreateResponse>> DeleteDocket(Guid docketId);
    Task<BaseResponse<CommonCreateResponse>> DocketCancel(Guid id, Guid userId);
    Task<BaseResponse<CommonCreateResponse>> DocketReject(Guid id, Guid userId, string? remarks);
    Task<BaseResponse<IEnumerable<LspTATData>>> GetTATdata(Guid CustomerId, Guid? LspId, string? origin, string? destination);
    Task<BaseResponse<IEnumerable<DocketExcelUploadValidate>>> GetValidateDocketImportData(List<Dictionary<string, string>> bulkDocket, Guid customerid);
    Task<BaseResponse<CommonCreateResponse>> InsertDocketData(List<DocketEntryExcelUpload> docketlist, Guid entryBy);
    Task<BaseResponse<CommonCreateResponse>> ImportPOD(List<PODDataList> podDataList, Guid User);
    Task<BaseResponse<IEnumerable<DocketStatusResponseData>>> GetValidateDocketStatusUpdateData(List<Dictionary<string, string>> bulkDocket, Guid Lspid);
    Task<BaseResponse<CommonCreateResponse>> UpdateDocketStatus(List<DocketStatusUpdate> docketstslist, Guid entryBy);
    Task<BaseResponse<IEnumerable<ValidatePODResponse>>> ValidatePODUplaodData(string jsonDocketData,string jsonImageNames, Guid lspuser);
    Task<BaseResponse<CommonCreateResponse>> SinglePODUploadFile(string docketNo, DocketPODUploadReq docPod, Guid lspuser);
    Task<BaseResponse<IEnumerable<DownloadDocketResponse>>> DownloadDocket(Guid userId);
}