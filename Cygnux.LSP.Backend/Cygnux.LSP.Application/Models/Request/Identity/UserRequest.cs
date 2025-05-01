namespace Cygnux.LSP.Application.Models.Request.Identity;

public class UserRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    //public string[] Roles { get; set; }
    public string Roles { get; set; }

}

public  class DeleteUserReq
{
    public Guid id { get; set; }
    public bool IsDeleted { get; set; }
    public string City { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string Location {get;set;} = string.Empty;
    public string UserType { get;set;} = string.Empty;
    public string Locality {get;set;} = string.Empty;
    public string Address {get;set;} = string.Empty;
    public string ZipCode {get;set;} = string.Empty;
    public DateTime? SessionTime { get;set;}
}