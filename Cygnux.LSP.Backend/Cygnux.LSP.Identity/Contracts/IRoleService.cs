namespace Cygnux.LSP.Identity.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response;
using Entities;
using Microsoft.AspNetCore.Identity;
using Models;

public interface IRoleService
{
    Task<IEnumerable<RoleResponse>> GetRoleList(string reqFilter);

    Task<RoleResponse?> GetRoleDetails(Guid id);
    Task<Role_Message> RoleIfNotExists(string Name);

    Task<IdentityResult> AddRole(ApplicationRole applicationRole);

    Task<IdentityResult> UpdateRole(Guid roleId, ApplicationRole applicationRole);

    Task<IdentityResult> DeleteRole(Guid roleId, DeleteRole deleterole);
}