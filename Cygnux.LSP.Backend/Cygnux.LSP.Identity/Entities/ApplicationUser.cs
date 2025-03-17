namespace Cygnux.LSP.Identity.Entities;

using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
    public Guid EntryBy { get; set; }
    public DateTime EntryDate { get; set; }
}