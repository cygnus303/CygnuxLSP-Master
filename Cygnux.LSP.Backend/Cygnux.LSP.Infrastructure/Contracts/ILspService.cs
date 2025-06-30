namespace Cygnux.LSP.Infrastructure.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.Customer;
using Models.Response;
using Models.Response.Lsp;

public interface ILspService
{
    Task<IEnumerable<LspListResponse>> GetLspList(Guid userId, string jsonreq);

    Task<LspDetailResponse> GetLspDetails(Guid lspid);

    Task<CommonCreateResponse> AddLsp(string addLspJson);

    Task<CommonCreateResponse> UpdateLsp(Guid id, string updateLspJson);

    Task<CommonCreateResponse> DeleteLsp(Guid lspid);
    Task<DeleteLSPDataResponse> DeleteLSPDetails(Guid lspid);
    Task<IEnumerable<LSPCount>> LspCount();


}