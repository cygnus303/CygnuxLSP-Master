namespace Cygnux.LSP.Identity.Entities;

using Microsoft.AspNetCore.Identity;

public class ApplicationRole : IdentityRole<Guid>
{
    public Guid EntryBy { get; set; }
    public DateTime EntryDate { get; set; } = DateTime.Now;
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
}

public class DeleteRole : IdentityRole<Guid>
{
    public Guid id {  get; set; }
    public bool IsDeleted { get; set; }
}