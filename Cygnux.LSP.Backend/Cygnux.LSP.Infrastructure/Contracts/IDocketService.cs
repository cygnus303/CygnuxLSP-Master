namespace Cygnux.LSP.Infrastructure.Contracts;

using Models.Response;
using Models.Response.Docket;

public interface IDocketService
{
    Task<IEnumerable<DocketListResponse>> GetDocketList(int page, int pageSize);

    Task<DocketDetailResponse> GetDocketDetails(Guid docketId);
    Task<CommonCreateResponse> ImportDocket(string addDocketsJson);
    Task<CommonCreateResponse> AddDocket(string addDocketJson);

    Task<CommonCreateResponse> UpdateDocket(Guid id, string updateDocketJson);

    Task<CommonCreateResponse> DeleteDocket(Guid id);
}