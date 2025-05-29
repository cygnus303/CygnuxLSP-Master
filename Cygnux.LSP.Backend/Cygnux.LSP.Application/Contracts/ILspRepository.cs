namespace Cygnux.LSP.Application.Contracts;

using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Lsp;
using Models.Request.Lsp;
using Models.Response;

public interface ILspRepository
{
    Task<BaseResponse<IEnumerable<LspListResponse>>> GetLspList(Guid userId, Dictionary<string, string> jsonreq);

    Task<BaseResponse<LspDetailResponse?>> GetLspDetails(Guid lspid);

    Task<BaseResponse<CommonCreateResponse>> AddLsp(CreateLspRequest createLsp);

    Task<BaseResponse<CommonCreateResponse>> UpdateLsp(Guid id, CreateLspRequest createLsp);

    Task<BaseResponse<CommonCreateResponse>> DeleteLsp(Guid lspid);
    Task<BaseResponse<DeleteLSPDataResponse?>> DeleteLSPDetails(Guid lspid);
}