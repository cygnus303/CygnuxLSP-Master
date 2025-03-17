namespace Cygnux.LSP.Application.Implementations;

using Contracts;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Docket;
using Models.Request.Docket;
using Models.Response;
using Newtonsoft.Json;

internal class DocketRepository : IDocketRepository
{
    private readonly IDocketService _docketService;

    public DocketRepository(IDocketService docketService)
    {
        _docketService = docketService;
    }

    public async Task<BaseResponse<IEnumerable<DocketListResponse>>> GetDocketList(int page, int pageSize)
    {
        var response = await _docketService.GetDocketList(page, pageSize);
        return new BaseResponse<IEnumerable<DocketListResponse>>(response);
    }

    public async Task<BaseResponse<DocketDetailResponse?>> GetDocketDetails(Guid docketId)
    {
        var response = await _docketService.GetDocketDetails(docketId);

        return new BaseResponse<DocketDetailResponse?>(response);
    }
    
    public async Task<BaseResponse<CommonCreateResponse>> ImportDocket(List<Dictionary<string, string>> createDockets)
    {
        var response = await _docketService.ImportDocket(JsonConvert.SerializeObject(createDockets));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
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
}