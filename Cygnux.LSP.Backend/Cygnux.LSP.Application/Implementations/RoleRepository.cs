namespace Cygnux.LSP.Application.Implementations;

using Contracts;
using Cygnux.LSP.Infrastructure.Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
using Identity.Contracts;
using Identity.Entities;
using Identity.Models;
using Infrastructure.Models.Response;
using Models.Request.Role;
using Models.Response;
using Newtonsoft.Json;
using System.Collections.Generic;

internal class RoleRepository : IRoleRepository
{
    private readonly IRoleService _roleService;

    public RoleRepository(IRoleService roleService)
    {
        _roleService = roleService;
    }

    public async Task<BaseResponse<IEnumerable<RoleResponse>>> GetRoleList(Dictionary<string, string> reqFilter)
    {
        var response = await _roleService.GetRoleList(JsonConvert.SerializeObject(reqFilter));

        return new BaseResponse<IEnumerable<RoleResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }


    public async Task<BaseResponse<RoleResponse?>> GetRoleDetails(Guid id)
    {
        var response = await _roleService.GetRoleDetails(id);
        return new BaseResponse<RoleResponse?>(response);
    }

    public async Task<BaseResponse<Role_Message>> RoleIfNotExists(Guid RoleId)
    {
        var response = await _roleService.RoleIfNotExists(RoleId);
        return new BaseResponse<Role_Message>(response);
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


    public async Task<BaseResponse<CommonCreateResponse>> DeleteRole(Guid roleId, RoleDeleteReq deletereq)
    {
        var deleterole = new DeleteRole
        {
            IsDeleted = deletereq.IsDeleted
        };
        var response = await _roleService.DeleteRole(roleId, deleterole);

        return new BaseResponse<CommonCreateResponse>(new CommonCreateResponse { Status = response.Succeeded ? 1 : 0, Message = "Role Deleted Done!" });
    }
}