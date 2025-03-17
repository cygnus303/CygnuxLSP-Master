namespace Cygnux.LSP.Application.Models.Request.Menu;

public class CreateMenuRequest
{
    public string MenuId { get; set; } = string.Empty;
    public string MenuName { get; set; } = string.Empty;

    public string NavigationUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; }

    public string Icon { get; set; } = string.Empty;
}