namespace Cygnux.LSP.Application.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Cygnux.LSP.Infrastructure.Models.Response.Tracking;
using Identity.Models;
using Models.Request.Auth;
using Models.Response;

public interface ITrackingRepository
{
    Task<BaseResponse<IEnumerable<TrackingDocketResponse>>> GetTrackigList(string docketNOs,Guid userid);
    Task<BaseResponse<IEnumerable<Trackinglist>>> GetDashboardList(Guid userid, string fromDate, string toDate);
}