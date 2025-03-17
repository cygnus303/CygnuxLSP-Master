namespace CygnuxLSP.API.Models;

public class UserLogin
{
    /// <summary>
    /// Gets or sets email
    /// </summary>

    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets password
    /// </summary>

    public string Password { get; set; } = string.Empty;
}