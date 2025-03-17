namespace Cygnux.LSP.Identity.Models;

public class UserResponse
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public string? EmailId { get; set; }
    public bool IsActive { get; set; }
    public string? PhoneNumber { get; set; }

    public string[] Roles { get; set; }
    public int? TotalCount { get; set; }
}