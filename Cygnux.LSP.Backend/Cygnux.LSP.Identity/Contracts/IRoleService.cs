namespace Cygnux.LSP.Identity.Contracts;

using Entities;
using Microsoft.AspNetCore.Identity;
using Models;

public interface IRoleService
{
    Task<IEnumerable<RoleResponse>> GetRoleList();

    Task<RoleResponse?> GetRoleDetails(Guid id);

    Task<IdentityResult> AddRole(ApplicationRole applicationRole);

    Task<IdentityResult> UpdateRole(Guid roleId, ApplicationRole applicationRole);
}