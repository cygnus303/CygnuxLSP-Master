namespace Cygnux.LSP.Application.Contracts;

using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Lsp;
using Models.Request.Lsp;
using Models.Response;

public interface ILspRepository
{
    Task<BaseResponse<IEnumerable<LspListResponse>>> GetLspList(int page, int pageSize);

    Task<BaseResponse<LspDetailResponse?>> GetLspDetails(Guid id);

    Task<BaseResponse<CommonCreateResponse>> AddLsp(CreateLspRequest createLsp);

    Task<BaseResponse<CommonCreateResponse>> UpdateLsp(Guid id, CreateLspRequest createLsp);

    Task<BaseResponse<CommonCreateResponse>> DeleteLsp(Guid id);
}