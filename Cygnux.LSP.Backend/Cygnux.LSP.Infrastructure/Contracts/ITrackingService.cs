namespace Cygnux.LSP.Infrastructure.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Models.Response;
using Models.Response.LspMapping;

public interface ITrackingservice
{
    Task<IEnumerable<DocketListResponse>> GetTrackigList(string docketNOs, Guid userid);
}