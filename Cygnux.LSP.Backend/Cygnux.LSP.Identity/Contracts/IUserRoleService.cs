using Microsoft.AspNetCore.Identity;

namespace Cygnux.LSP.Identity.Contracts;

public interface IUserRoleService
{
    Task<IdentityResult> AddUserRole(Guid userId, string roleName);

    Task<IdentityResult> AddUserRole(Guid userId, string emailId, string roleName);

    Task<IdentityResult> UpdateUserRoles(Guid userId, List<string> roles);
}