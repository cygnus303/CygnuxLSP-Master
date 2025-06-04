namespace Cygnux.LSP.Infrastructure.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Cygnux.LSP.Infrastructure.Models.Response.Tracking;
using Models.Response;
using Models.Response.LspMapping;

public interface ITrackingservice
{
    Task<IEnumerable<TrackingDocketResponse>> GetTrackigList(string docketNOs, Guid userid);
}