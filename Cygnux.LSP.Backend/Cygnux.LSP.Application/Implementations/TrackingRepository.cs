namespace Cygnux.LSP.Application.Implementations;

using Azure;
using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.LspMapping;
using Models.Request.CustomerLSPTAT;
using Models.Request.LspMapping;
using Models.Response;
using Newtonsoft.Json;

internal class Trackingrepository : ITrackingRepository
{
    private readonly ITrackingservice _trackingService;

    public Trackingrepository(ITrackingservice trackingService)
    {
        _trackingService = trackingService;
    }
    public async Task<BaseResponse<IEnumerable<DocketListResponse>>> GetTrackigList(string Docketnumber)
    {
        var response = await _trackingService.GetTrackigList(Docketnumber);
        return new BaseResponse<IEnumerable<DocketListResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

}