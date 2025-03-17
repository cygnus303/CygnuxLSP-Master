namespace Cygnux.LSP.Identity.Models;

public class RoleResponse
{
    public Guid Id { get; set; }
    public string? RoleName { get; set; }

    public bool IsActive { get; set; }
}