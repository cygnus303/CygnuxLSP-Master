namespace Cygnux.LSP.Infrastructure.Contracts;

using Models.Response;
using Models.Response.Lsp;

public interface ILspService
{
    Task<IEnumerable<LspListResponse>> GetLspList(int page, int pageSize);

    Task<LspDetailResponse> GetLspDetails(Guid id);

    Task<CommonCreateResponse> AddLsp(string addLspJson);

    Task<CommonCreateResponse> UpdateLsp(Guid id, string updateLspJson);

    Task<CommonCreateResponse> DeleteLsp(Guid id);
}