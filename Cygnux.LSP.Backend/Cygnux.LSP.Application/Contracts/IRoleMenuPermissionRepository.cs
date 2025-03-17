namespace Cygnux.LSP.Application.Contracts;

using Infrastructure.Models.Response;
using Infrastructure.Models.Response.RoleMenuPermission;
using Models.Request.RoleMenuPermission;
using Models.Response;

public interface IRoleMenuPermissionRepository
{
    Task<BaseResponse<IEnumerable<RoleMenuPermissionResponse>>> GetRoleMenuPermissionList();

    Task<BaseResponse<RoleMenuPermissionResponse?>> GetRoleMenuPermissionDetails(Guid roleId, Guid menuId);

    Task<BaseResponse<IEnumerable<RoleMenuPermissionResponse>>> GetMenuPermissionByRole(Guid roleId);

    Task<BaseResponse<CommonCreateResponse>> AddRoleMenuPermission(Guid roleId, List<CreateRoleMenuPermissionRequest> createRoleMenuPermission);

    Task<BaseResponse<CommonCreateResponse>> UpdateRoleMenuPermission(Guid id, CreateRoleMenuPermissionRequest createRoleMenuPermission);

    Task<BaseResponse<CommonCreateResponse>> DeleteRoleMenuPermission(Guid id);
}