namespace Cygnux.LSP.Identity.Contracts;

using Entities;
using Microsoft.AspNetCore.Identity;
using Models;

public interface IRoleService
{
    Task<IEnumerable<RoleResponse>> GetRoleList(int page,int pageSize, string? roleName);

    Task<RoleResponse?> GetRoleDetails(Guid id);

    Task<IdentityResult> AddRole(ApplicationRole applicationRole);

    Task<IdentityResult> UpdateRole(Guid roleId, ApplicationRole applicationRole);

    Task<IdentityResult> DeleteRole(Guid roleId, DeleteRole deleterole);
}