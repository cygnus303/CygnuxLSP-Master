using System.Security.Claims;
using System.Security.Principal;

namespace CygnuxLSP.Web.Classes
{
    public static class ClaimsIdentityExtensions
    {
        public static string GetClaims(this IIdentity identity, string ClaimIdentityName)
        {
            if (ClaimIdentityName is null)
            {
                throw new ArgumentNullException(nameof(ClaimIdentityName));
            }

            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(ClaimIdentityName);

            return claim?.Value ?? string.Empty;
        }
    }
}
