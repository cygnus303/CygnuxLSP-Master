namespace Cygnux.LSP.Application.Implementations;

using Azure;
using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Cygnux.LSP.Infrastructure.Models.Response.Tracking;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.LspMapping;
using Models.Request.CustomerLSPTAT;
using Models.Request.LspMapping;
using Models.Response;
using Newtonsoft.Json;

internal class TrackingRepository : ITrackingRepository
{
    private readonly ITrackingservice _trackingService;

    public TrackingRepository(ITrackingservice trackingService)
    {
        _trackingService = trackingService;
    }
    public async Task<BaseResponse<IEnumerable<TrackingDocketResponse>>> GetTrackigList(string docketNOs,Guid userid)
    {
        var response = await _trackingService.GetTrackigList(docketNOs,userid);
        return new BaseResponse<IEnumerable<TrackingDocketResponse>>(response);
    }

}