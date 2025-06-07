namespace Cygnux.LSP.Infrastructure.Models.Response.Menu;

public class MenuResponse
{
    public Guid MenuId { get; set; }
    public string MenuName { get; set; } 
    public bool CanView { get; set; }
    public bool CanCreate { get; set; } 
    public bool CanEdit { get; set; } 
    public bool CanDelete { get; set; }
    public bool CanPOD { get; set; }
    public bool CanstatusUpdate { get; set; }

    public string NavigationUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; }

    public string Icon { get; set; } = string.Empty;
}