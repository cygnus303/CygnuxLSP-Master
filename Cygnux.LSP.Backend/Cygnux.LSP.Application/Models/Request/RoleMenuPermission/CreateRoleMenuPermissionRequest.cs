namespace Cygnux.LSP.Application.Models.Request.RoleMenuPermission;

public class CreateRoleMenuPermissionRequest
{
    public Guid MenuId { get; set; }
    public bool CanView { get; set; }
    public bool CanCreate { get; set; }
    public bool CanEdit { get; set; }
    public bool CanDelete { get; set; }
}