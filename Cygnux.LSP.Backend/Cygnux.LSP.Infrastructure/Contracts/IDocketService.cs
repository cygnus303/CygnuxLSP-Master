namespace Cygnux.LSP.Infrastructure.Contracts;

using Models.Response;
using Models.Response.Docket;

public interface IDocketService
{
    Task<IEnumerable<DocketListResponse>> GetDocketList(int page, int pageSize, Guid userId, string? docketNo, string? fromLocation, string? toLocation, int? quantity);

    Task<DocketDetailResponse> GetDocketDetails(Guid docketId, Guid userId);
    Task<CommonCreateResponse> ImportDocket(string addDocketsJson);
    Task<CommonCreateResponse> AddDocket(string addDocketJson);

    Task<CommonCreateResponse> UpdateDocket(Guid id, string updateDocketJson);

    Task<CommonCreateResponse> DeleteDocket(Guid id);
}