namespace Cygnux.LSP.Application.Implementations;

using Contracts;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Menu;
using Models.Request.Menu;
using Models.Response;
using Newtonsoft.Json;

internal class MenuRepository : IMenuRepository
{
    private readonly IMenuService _lspService;
    private readonly IUserSettings _userSettings;

    public MenuRepository(IMenuService lspService, IUserSettings userSettings)
    {
        _lspService = lspService;
        _userSettings = userSettings;
    }

    public async Task<BaseResponse<IEnumerable<MenuResponse>>> GetMenuList()
    {
        var response = await _lspService.GetMenuList(_userSettings.UserId);

        return new BaseResponse<IEnumerable<MenuResponse>>(response);
    }

    public async Task<BaseResponse<MenuResponse?>> GetMenuDetails(Guid id)
    {
        var response = await _lspService.GetMenuDetails(id);
        return new BaseResponse<MenuResponse?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddMenu(CreateMenuRequest createMenu)
    {
        var response = await _lspService.AddMenu(JsonConvert.SerializeObject(createMenu));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateMenu(Guid id, CreateMenuRequest createMenu)
    {
        var response = await _lspService.UpdateMenu(id, JsonConvert.SerializeObject(createMenu));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> DeleteMenu(Guid id)
    {
        var response = await _lspService.DeleteMenu(id);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
}