namespace Cygnux.LSP.Identity.Entities;

using Microsoft.AspNetCore.Identity;

public class ApplicationRole : IdentityRole<Guid>
{
    public Guid EntryBy { get; set; }
    public DateTime EntryDate { get; set; }
    public bool IsActive { get; set; }
}