namespace Cygnux.LSP.Infrastructure.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Cygnux.LSP.Infrastructure.Models.Response.Tracking;
using Models.Response;
using Models.Response.LspMapping;

public interface ITrackingservice
{
     Task<IEnumerable<Trackinglist>> GetDashboardList(Guid userid, string fromDate, string toDate);
    Task<IEnumerable<TrackingDocketResponse>> GetTrackigList(string docketNOs, Guid userid, string? fromDate, string? toDate, int skip, int take);
    Task<IEnumerable<TrackingChartResponse>> GetTransportChartData(Guid userId, string fromDate, string toDate);
    Task<IEnumerable<DownloadPODResponse>> DownloadPOD(Guid userId, string StartDate, string EndDate);

}