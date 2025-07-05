namespace Cygnux.LSP.Application.Implementations;

using Azure;
using Contracts;
using Cygnux.LSP.Infrastructure.Constants;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Cygnux.LSP.Infrastructure.Models.Response.Tracking;
using Dapper;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.LspMapping;
using Models.Request.CustomerLSPTAT;
using Models.Request.LspMapping;
using Models.Response;
using Newtonsoft.Json;
using System.Data;

internal class TrackingRepository : ITrackingRepository
{
    private readonly ITrackingservice _trackingService;

    public TrackingRepository(ITrackingservice trackingService)
    {
        _trackingService = trackingService;
    }
    public async Task<BaseResponse<IEnumerable<TrackingDocketResponse>>> GetTrackigList(string? docketNOs, Guid userid, string? fromDate, string? toDate, int skip, int take)
    {
        var response = await _trackingService.GetTrackigList(docketNOs, userid, fromDate, toDate, skip, take);
        return new BaseResponse<IEnumerable<TrackingDocketResponse>>(response);
    }

    public async Task<BaseResponse<IEnumerable<Trackinglist>>> GetDashboardList(Guid userid, string fromDate, string toDate)
    {
        var response = await _trackingService.GetDashboardList(userid, fromDate, toDate);
        return new BaseResponse<IEnumerable<Trackinglist>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<IEnumerable<TrackingChartResponse>>> GetTransportChartData(Guid userId, string fromDate, string toDate)
    {
        var response = await _trackingService.GetTransportChartData(userId, fromDate, toDate);
        return new BaseResponse<IEnumerable<TrackingChartResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<IEnumerable<DownloadPODResponse>>> DownloadPOD(Guid userid, string fromDate, string toDate)
    {
        var response = await _trackingService.DownloadPOD(userid, fromDate, toDate);
        return new BaseResponse<IEnumerable<DownloadPODResponse>>(response);
    }


}