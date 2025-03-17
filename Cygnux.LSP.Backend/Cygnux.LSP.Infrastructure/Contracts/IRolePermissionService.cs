namespace Cygnux.LSP.Infrastructure.Contracts;

using Models.Response;
using Models.Response.RoleMenuPermission;

public interface IRoleMenuPermissionService
{
    Task<IEnumerable<RoleMenuPermissionResponse>> GetRoleMenuPermissionList();

    Task<RoleMenuPermissionResponse?> GetRoleMenuPermissionDetails(Guid roleId, Guid menuId);

    Task<IEnumerable<RoleMenuPermissionResponse>> GetMenuPermissionByRole(Guid roleId);

    Task<CommonCreateResponse> AddRoleMenuPermission(Guid roleId, string addRoleMenuPermissionJson);

    Task<CommonCreateResponse> UpdateRoleMenuPermission(Guid id, string updateRoleMenuPermissionJson);

    Task<CommonCreateResponse> DeleteRoleMenuPermission(Guid id);
}