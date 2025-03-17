namespace Cygnux.LSP.Identity.Contracts;

using Identity.Entities;

public interface IJwtService
{
    public string GenerateEncodedToken(ApplicationUser userFromRepo);
}