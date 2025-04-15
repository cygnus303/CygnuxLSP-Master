namespace Cygnux.LSP.Application.Implementations;

using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.Customer;
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

    public async Task<BaseResponse<IEnumerable<DocketListResponse>>> GetDocketList(int page, int pageSize, Guid userId, string? docketNo, string? fromLocation, string? toLocation, int? quantity)
    {
        var response = await _docketService.GetDocketList(page, pageSize,userId,docketNo,fromLocation,toLocation,quantity);
        //return new BaseResponse<IEnumerable<DocketListResponse>>(response);
        return new BaseResponse<IEnumerable<DocketListResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<DocketDetailResponse?>> GetDocketDetails(Guid docketId, Guid userId)
    {
        var response = await _docketService.GetDocketDetails(docketId,userId);

        return new BaseResponse<DocketDetailResponse?>(response);
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

    public async Task<BaseResponse<CommonCreateResponse>> DeleteDocket(Guid docketId)
    {
        var response = await _docketService.DeleteDocket(docketId);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
    public async Task<BaseResponse<IEnumerable<LspTATData>>> GetTATdata(Guid CustomerId, string? origin, string? destination)
    {
        var response = await _docketService.GetTATdata(CustomerId, origin, destination);
        return new BaseResponse<IEnumerable<LspTATData>>(response);
        //return new BaseResponse<IEnumerable<LspTATData>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }
    public async Task<BaseResponse<IEnumerable<DocketBulkUploadValidateResponse>>> GetValidateDocketImportData(List<Dictionary<string, string>> bulkDocket, Guid customerid)
    {
        var response = await _docketService.GetValidateDocketImportData(JsonConvert.SerializeObject(bulkDocket),customerid);

        return new BaseResponse<IEnumerable<DocketBulkUploadValidateResponse>>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> ImportPOD(List<PODDataList> PodData, Guid User)
    {
        var response = await _docketService.ImportPOD(JsonConvert.SerializeObject(PodData),User);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

}