namespace Cygnux.LSP.Infrastructure.Contracts;

using Models.Response;
using Models.Response.Menu;

public interface IMenuService
{
    Task<IEnumerable<MenuResponse>> GetMenuList(string userId);

    Task<MenuResponse?> GetMenuDetails(Guid id);

    Task<CommonCreateResponse> AddMenu(string addMenuJson);

    Task<CommonCreateResponse> UpdateMenu(Guid id, string updateMenuJson);

    Task<CommonCreateResponse> DeleteMenu(Guid id);
}