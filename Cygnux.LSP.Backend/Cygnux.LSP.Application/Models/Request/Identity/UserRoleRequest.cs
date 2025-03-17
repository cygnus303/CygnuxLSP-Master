namespace Cygnux.LSP.Application.Models.Request.Identity;

public class UserRoleRequest
{
    public string UserId { get; set; } = string.Empty;
    public string RoleId { get; set; } = string.Empty;
}