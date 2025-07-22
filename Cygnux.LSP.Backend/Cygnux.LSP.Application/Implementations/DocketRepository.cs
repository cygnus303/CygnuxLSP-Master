namespace Cygnux.LSP.Application.Implementations;

using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.Customer;
using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
using Cygnux.LSP.Infrastructure.Models.Response.RoleMenuPermission;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Docket;
using Models.Request.Docket;
using Models.Response;
using Newtonsoft.Json;
using System.Reflection.Emit;

internal class DocketRepository : IDocketRepository
{
    private readonly IDocketService _docketService;

    public DocketRepository(IDocketService docketService)
    {
        _docketService = docketService;
    }

    public async Task<BaseResponse<IEnumerable<DocketListResponse>>> GetDocketList(Guid userId, Dictionary<string, string> reqFilter)
    {
        var response = await _docketService.GetDocketList(userId, JsonConvert.SerializeObject(reqFilter));
        return new BaseResponse<IEnumerable<DocketListResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<IEnumerable<DownloadDocketResponse>>> DownloadDocket(Guid userId)
    {
        var response = await _docketService.DownloadDocket(userId);
        return new BaseResponse<IEnumerable<DownloadDocketResponse>>(response);
    }

    public async Task<BaseResponse<DocketDetailResponse?>> GetDocketDetails(Guid docketId)
    {
        var response = await _docketService.GetDocketDetails(docketId);

        return new BaseResponse<DocketDetailResponse?>(response);
    }

    public async Task<BaseResponse<IEnumerable<City_Master>>> GetCityData(string stcd)
    {
        
        var response = await _docketService.GetCityData(stcd);

        return new BaseResponse<IEnumerable<City_Master>>(response);
    }
    
    public async Task<BaseResponse<IEnumerable<State_Master>>> GetStateData(string SearchTerm)
    {
        
        var response = await _docketService.GetStateData(SearchTerm);

        return new BaseResponse<IEnumerable<State_Master>>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> ImportDocket(List<Dictionary<string, string>> createDockets)
    {
        var response = await _docketService.ImportDocket(JsonConvert.SerializeObject(createDockets));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<IEnumerable<TrackingList>>> GetTrackingList(string codetype)
    {
        var response = await _docketService.GetTrackingList(codetype);

        return new BaseResponse<IEnumerable<TrackingList>>(response);
    }
    public async Task<BaseResponse<IEnumerable<DocList>>> GetDocketData(string docketno)
    {
        var response = await _docketService.GetDocketData(docketno);

        return new BaseResponse<IEnumerable<DocList>>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddDocket(CreateDocketRequest createDocketRequest)
    {
        var response = await _docketService.AddDocket(JsonConvert.SerializeObject(createDocketRequest));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateDocket(Guid docketId, CreateDocketRequest createDocketRequest)
    {
        var response = await _docketService.UpdateDocket(docketId, JsonConvert.SerializeObject(createDocketRequest));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> SingleDocketStsUpdate(Guid DocketId, DocketStatusReq docksts, Guid user)
    {
        var response = await _docketService.SingleDocketStsUpdate(DocketId, JsonConvert.SerializeObject(docksts),user);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> DeleteDocket(Guid docketId)
    {
        var response = await _docketService.DeleteDocket(docketId);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> DocketCancel(Guid id, Guid userId)
    {
        var result = await _docketService.DocketCancel(id, userId);

        if (result?.Status > 0)
        {
            return new BaseResponse<CommonCreateResponse>(result);
        }

        return new BaseResponse<CommonCreateResponse>(
            new ErrorResponse { Message = result?.Message ?? "Docket deletion failed." }
        );
    }

    public async Task<BaseResponse<CommonCreateResponse>> DocketReject(Guid id, Guid userId, string? remarks = null)
    {
        var result = await _docketService.DocketReject(id, userId, remarks);

        if (result?.Status > 0)
        {
            return new BaseResponse<CommonCreateResponse>(result);
        }

        return new BaseResponse<CommonCreateResponse>(
            new ErrorResponse { Message = result?.Message ?? "Reject failed." }
        );
    }


    public async Task<BaseResponse<IEnumerable<LspTATData>>> GetTATdata(Guid CustomerId, Guid? LspId, string? origin, string? destination)
    {
        var response = await _docketService.GetTATdata(CustomerId, LspId, origin, destination);
        return new BaseResponse<IEnumerable<LspTATData>>(response);
        //return new BaseResponse<IEnumerable<LspTATData>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }
    public async Task<BaseResponse<IEnumerable<DocketExcelUploadValidate>>> GetValidateDocketImportData(List<Dictionary<string, string>> bulkDocket, Guid customerid)
    {
        var response = await _docketService.GetValidateDocketImportData(JsonConvert.SerializeObject(bulkDocket),customerid);

        return new BaseResponse<IEnumerable<DocketExcelUploadValidate>>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> ImportPOD(List<PODDataList> podDataList, Guid User)
    {
        var response = await _docketService.ImportPOD(JsonConvert.SerializeObject(podDataList), User);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
    public async Task<BaseResponse<CommonCreateResponse>> InsertDocketData(List<DocketEntryExcelUpload> docketlist, Guid entryBy)
    {
        var response = await _docketService.InsertDocketData(JsonConvert.SerializeObject(docketlist), entryBy);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
    public async Task<BaseResponse<IEnumerable<DocketStatusResponseData>>> GetValidateDocketStatusUpdateData(List<Dictionary<string, string>> bulkDocket, Guid Lspid)
    {
        var response = await _docketService.GetValidateDocketStatusUpdateData(JsonConvert.SerializeObject(bulkDocket), Lspid);

        return new BaseResponse<IEnumerable<DocketStatusResponseData>>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateDocketStatus(List<DocketStatusUpdate> docketstslist, Guid entryBy)
    {
        var response = await _docketService.UpdateDocketStatus(JsonConvert.SerializeObject(docketstslist), entryBy);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
    public async Task<BaseResponse<IEnumerable<ValidatePODResponse>>> ValidatePODUplaodData(string jsonDocketData, string jsonImageNames, Guid lspuser)
    {
        var response = await _docketService.ValidatePODUplaodData(jsonDocketData,jsonImageNames,lspuser);

        return new BaseResponse<IEnumerable<ValidatePODResponse>>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> SinglePODUploadFile(string docketNo, DocketPODUploadReq docPod, Guid lspuser)
    {
        var response = await _docketService.SinglePODUploadFile(docketNo, JsonConvert.SerializeObject(docPod),lspuser);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
}