namespace Cygnux.LSP.Application.Implementations;

using Contracts;
using Infrastructure.Contracts;
using Infrastructure.Models.Response;
using Infrastructure.Models.Response.RoleMenuPermission;
using Models.Request.RoleMenuPermission;
using Models.Response;
using Newtonsoft.Json;

internal class RoleMenuPermissionRepository : IRoleMenuPermissionRepository
{
    private readonly IRoleMenuPermissionService _roleMenuPermissionService;

    public RoleMenuPermissionRepository(IRoleMenuPermissionService roleMenuPermissionService)
    {
        _roleMenuPermissionService = roleMenuPermissionService;
    }

    public async Task<BaseResponse<IEnumerable<RoleMenuPermissionResponse>>> GetRoleMenuPermissionList()
    {
        var response = await _roleMenuPermissionService.GetRoleMenuPermissionList();

        return new BaseResponse<IEnumerable<RoleMenuPermissionResponse>>(response);
    }

    public async Task<BaseResponse<RoleMenuPermissionResponse?>> GetRoleMenuPermissionDetails(Guid roleId, Guid menuId)
    {
        var response = await _roleMenuPermissionService.GetRoleMenuPermissionDetails(roleId, menuId);
        return new BaseResponse<RoleMenuPermissionResponse?>(response);
    }

    public async Task<BaseResponse<IEnumerable<RoleMenuPermissionResponse>>> GetMenuPermissionByRole(Guid roleId)
    {
        var response = await _roleMenuPermissionService.GetMenuPermissionByRole(roleId);
        return new BaseResponse<IEnumerable<RoleMenuPermissionResponse>>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddRoleMenuPermission(Guid roleId, List<CreateRoleMenuPermissionRequest> createRoleMenuPermission)
    {
        var response = await _roleMenuPermissionService.AddRoleMenuPermission(roleId, JsonConvert.SerializeObject(createRoleMenuPermission));
        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateRoleMenuPermission(Guid id, CreateRoleMenuPermissionRequest createRoleMenuPermission)
    {
        var response = await _roleMenuPermissionService.UpdateRoleMenuPermission(id, JsonConvert.SerializeObject(createRoleMenuPermission));

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> DeleteRoleMenuPermission(Guid id)
    {
        var response = await _roleMenuPermissionService.DeleteRoleMenuPermission(id);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
            : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
}