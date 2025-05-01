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
    public string? City { get; set; } = string.Empty;
    public string? CustomerName { get; set; } = string.Empty;
    public string? Location { get; set; } = string.Empty;
    public string? UserType { get; set; } = string.Empty;
    public string? Locality { get; set; } = string.Empty;
    public string? Address { get; set; } = string.Empty;
    public string? ZipCode { get; set; } = string.Empty;
    public DateTime? SessionTime { get; set; }
}

public class DeleteUser : IdentityUser<Guid>
{
    public Guid id { get; set; }
    public bool IsDeleted { get; set; }
   
}