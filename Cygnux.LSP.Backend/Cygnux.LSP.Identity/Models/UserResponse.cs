namespace Cygnux.LSP.Identity.Models;

public class UserResponse
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public string? EmailId { get; set; }
    public bool IsActive { get; set; }
    public string? PhoneNumber { get; set; }

    public string Roles { get; set; }
    public int? TotalCount { get; set; }
    public string? City { get; set; } = string.Empty;
    public string? CustomerName { get; set; } = string.Empty;
    public string? Location { get; set; } = string.Empty;
    public string? UserType { get;set;} = string.Empty;
    public string? Locality {get;set;} = string.Empty;
    public string? Address {get;set;} = string.Empty;
    public string? ZipCode {get;set;} = string.Empty;
    public int SessionTime { get;set;} 

}