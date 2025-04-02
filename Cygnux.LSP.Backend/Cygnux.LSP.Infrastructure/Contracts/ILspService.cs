namespace Cygnux.LSP.Infrastructure.Contracts;

using Models.Response;
using Models.Response.Lsp;

public interface ILspService
{
    Task<IEnumerable<LspListResponse>> GetLspList(int page, int pageSize, Guid userId, string? lspName, char? mobileNo, string? alias, string? description);

    Task<LspDetailResponse> GetLspDetails(Guid id, Guid userId);

    Task<CommonCreateResponse> AddLsp(string addLspJson);

    Task<CommonCreateResponse> UpdateLsp(Guid id, string updateLspJson);

    Task<CommonCreateResponse> DeleteLsp(Guid id);
}