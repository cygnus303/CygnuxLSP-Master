namespace Cygnux.LSP.Application.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Identity.Models;
using Models.Request.Auth;
using Models.Response;

public interface ITrackingRepository
{
    Task<BaseResponse<IEnumerable<DocketListResponse>>> GetTrackigList(string docketNOs,Guid userid);
}