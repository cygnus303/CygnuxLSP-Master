namespace Cygnux.LSP.Application.Implementations;

using Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.Customer;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
using Identity.Contracts;
using Infrastructure.Constants;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Lsp;
using Models.Request.Lsp;
using Models.Response;
using Newtonsoft.Json;

internal class LspRepository : ILspRepository
{
    private readonly ILspService _lspService;
    private readonly IUserRoleService _userRoleService;

    public LspRepository(ILspService lspService, IUserRoleService userRoleService)
    {
        _lspService = lspService;
        _userRoleService = userRoleService;
    }

    public async Task<BaseResponse<IEnumerable<LspListResponse>>> GetLspList(Guid userId, Dictionary<string, string> jsonreq)
    {
        var response = await _lspService.GetLspList(userId, JsonConvert.SerializeObject(jsonreq));

        return new BaseResponse<IEnumerable<LspListResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
        //return new BaseResponse<IEnumerable<DocketListResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());

    }

    public async Task<BaseResponse<LspDetailResponse>> GetLspDetails(Guid lspid)
    {
        var response = await _lspService.GetLspDetails(lspid);
        return new BaseResponse<LspDetailResponse>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddLsp(CreateLspRequest createLsp)
    {
        var response = await _lspService.AddLsp(JsonConvert.SerializeObject(createLsp));
        if (response.Status > 0)
        {
            //var identityResult = await _userRoleService.AddUserRole(Guid.NewGuid(), createLsp.EmailId, CommonConstants.LspAdminRole);
            //if (!identityResult.Succeeded)
            //{
            //    return new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = identityResult.Errors.FirstOrDefault()?.Description });
            //}

            return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
        }
        else
        {
            return new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
        }
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateLsp(Guid id, CreateLspRequest createLsp)
    {
        var response = await _lspService.UpdateLsp(id, JsonConvert.SerializeObject(createLsp));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> DeleteLsp(Guid lspid)
    {
        var response = await _lspService.DeleteLsp(lspid);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<DeleteLSPDataResponse>> DeleteLSPDetails(Guid lspid)
    {
        var response = await _lspService.DeleteLSPDetails(lspid);
        return new BaseResponse<DeleteLSPDataResponse>(response);
    }

    public async Task<BaseResponse<IEnumerable<LSPCount>>> LspCount()
    {
        var response = await _lspService.LspCount();
        return new BaseResponse<IEnumerable<LSPCount>>(response);
    }

    public async Task<BaseResponse<IEnumerable<LspResponse>>> Lsps(Guid lspid)
    {
        var response = await _lspService.Lsps(lspid);
        return new BaseResponse<IEnumerable<LspResponse>>(response);
    }

    public async Task<BaseResponse<IEnumerable<DownloadLsp>>> DownloadLsp(Guid userId)
    {
        var response = await _lspService.DownloadLsp(userId);
        return new BaseResponse<IEnumerable<DownloadLsp>>(response);
    }
}