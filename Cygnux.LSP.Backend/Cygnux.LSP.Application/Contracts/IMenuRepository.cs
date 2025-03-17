namespace Cygnux.LSP.Application.Contracts;

using Infrastructure.Models.Response;
using Infrastructure.Models.Response.Menu;
using Models.Request.Menu;
using Models.Response;

public interface IMenuRepository
{
    Task<BaseResponse<IEnumerable<MenuResponse>>> GetMenuList();

    Task<BaseResponse<MenuResponse?>> GetMenuDetails(Guid id);

    Task<BaseResponse<CommonCreateResponse>> AddMenu(CreateMenuRequest createMenu);

    Task<BaseResponse<CommonCreateResponse>> UpdateMenu(Guid id, CreateMenuRequest createMenu);

    Task<BaseResponse<CommonCreateResponse>> DeleteMenu(Guid id);
}