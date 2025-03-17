namespace Cygnux.LSP.Infrastructure.Models.Response.RoleMenuPermission;

public class RoleMenuPermissionResponse
{
    public Guid? RoleId { get; set; }
    public Guid MenuId { get; set; }
    public string MenuName { get; set; } = string.Empty;
    public bool CanView { get; set; }
    public bool CanEdit { get; set; }
    public bool CanDelete { get; set; }
}