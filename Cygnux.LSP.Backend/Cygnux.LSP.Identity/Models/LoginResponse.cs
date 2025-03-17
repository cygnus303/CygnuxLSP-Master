namespace Cygnux.LSP.Identity.Models;

public class LoginResponse
{
    public bool IsAdmin { get; set; }
    public string Token { get; set; } = string.Empty;

    public IList<string>? Roles { get; set; }
       
}