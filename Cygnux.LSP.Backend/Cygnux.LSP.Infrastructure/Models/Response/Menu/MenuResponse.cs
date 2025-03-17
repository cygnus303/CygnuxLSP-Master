namespace Cygnux.LSP.Infrastructure.Models.Response.Menu;

public class MenuResponse
{
    public Guid MenuId { get; set; }
    public string MenuName { get; set; } = string.Empty;

    public string NavigationUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; }

    public string Icon { get; set; } = string.Empty;
}