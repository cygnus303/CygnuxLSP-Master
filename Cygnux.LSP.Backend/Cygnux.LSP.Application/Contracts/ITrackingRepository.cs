namespace Cygnux.LSP.Application.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Cygnux.LSP.Infrastructure.Models.Response.Tracking;
using Identity.Models;
using Models.Request.Auth;
using Models.Response;

public interface ITrackingRepository
{
    Task<BaseResponse<IEnumerable<TrackingDocketResponse>>> GetTrackigList(string docketNOs,Guid userid, string? fromDate, string? toDate, int skip, int take);
    Task<BaseResponse<IEnumerable<Trackinglist>>> GetDashboardList(Guid userid, string fromDate, string toDate);
    Task<BaseResponse<IEnumerable<TrackingChartResponse>>> GetTransportChartData(Guid userId, string fromDate, string toDate);
    Task<BaseResponse<IEnumerable<DownloadPODResponse>>> DownloadPOD(Guid userid, string fromDate, string toDate);

}