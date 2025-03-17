namespace Cygnux.LSP.Identity.Implementations;

using Contracts;
using Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class JwtService : IJwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration configuration)
    {
        _config = configuration;
    }

    public string GenerateEncodedToken(ApplicationUser userFromRepo)
    {
        string key = _config["Jwt:Key"] ?? string.Empty;
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var claims = new[]
    {
    new Claim("userId", userFromRepo.Id.ToString())
};
        var Sectoken = new JwtSecurityToken(_config["Jwt:Issuer"],
          _config["Jwt:Audience"],
          claims,
          expires: DateTime.Now.AddMinutes(120),
          signingCredentials: credentials);

        var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);
        return token;
    }
}