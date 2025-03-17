namespace Cygnux.LSP.Application.Models.Request.Role;

public class RoleRequest
{
    public string RoleName { get; set; } = string.Empty;

    public bool? IsActive { get; set; }
}