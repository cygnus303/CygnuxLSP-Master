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
    public async Task<BaseResponse<IEnumerable<TrackingDocketResponse>>> GetTrackigList(string? docketNOs,Guid userid)
    {
        var response = await _trackingService.GetTrackigList(docketNOs,userid);
        return new BaseResponse<IEnumerable<TrackingDocketResponse>>(response);
    }

    public async Task<BaseResponse<IEnumerable<Trackinglist>>> GetDashboardList(Guid userid, string fromDate, string toDate)
    {
        var response = await _trackingService.GetDashboardList(userid, fromDate, toDate);
        return new BaseResponse<IEnumerable<Trackinglist>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<IEnumerable<TrackingChartResponse>>> GetTransportChartData(Guid userId, string fromDate, string toDate)
    {
        var docketList = await _trackingService.GetTrackigList(null, userId);
        var grouped = docketList.GroupBy(x => x.TransportModeDesc)
        .Select(g => new TrackingChartResponse
            {
                Mode = g.Key,
                TotalCount = g.Count()
            }).ToList();
        return new BaseResponse<IEnumerable<TrackingChartResponse>>(grouped, grouped.Sum(x => x.TotalCount));
    }

}