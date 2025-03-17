namespace Cygnux.LSP.Application.Implementations;

using Contracts;
using Identity.Contracts;
using Identity.Entities;
using Identity.Models;
using Infrastructure.Models.Response;
using Models.Request.Role;
using Models.Response;

internal class RoleRepository : IRoleRepository
{
    private readonly IRoleService _roleService;

    public RoleRepository(IRoleService roleService)
    {
        _roleService = roleService;
    }

    public async Task<BaseResponse<IEnumerable<RoleResponse>>> GetRoleList()
    {
        var response = await _roleService.GetRoleList();

        return new BaseResponse<IEnumerable<RoleResponse>>(response);
    }

    public async Task<BaseResponse<RoleResponse?>> GetRoleDetails(Guid id)
    {
        var response = await _roleService.GetRoleDetails(id);
        return new BaseResponse<RoleResponse?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddRole(RoleRequest roleRequest)
    {
        var applicationRole = new ApplicationRole
        {
            IsActive = roleRequest.IsActive ?? true,
            Name = roleRequest.RoleName
        };
        var response = await _roleService.AddRole(applicationRole);
        return new BaseResponse<CommonCreateResponse>(new CommonCreateResponse { Status = response.Succeeded ? 1 : 0, Message = "Role created successfully!" });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateRole(Guid id, RoleRequest roleRequest)
    {
        var applicationRole = new ApplicationRole
        {
            IsActive = roleRequest.IsActive ?? false,
            Name = roleRequest.RoleName
        };
        var response = await _roleService.UpdateRole(id, applicationRole);
        return new BaseResponse<CommonCreateResponse>(new CommonCreateResponse { Status = response.Succeeded ? 1 : 0, Message = "Role updated successfully!" });
    }
}