namespace Cygnux.LSP.Application.Contracts;

using Identity.Models;
using Infrastructure.Models.Response;
using Models.Request.Role;
using Models.Response;

public interface IRoleRepository
{
    Task<BaseResponse<IEnumerable<RoleResponse>>> GetRoleList(Dictionary<string, string> reqFilter);

    Task<BaseResponse<RoleResponse?>> GetRoleDetails(Guid id);
    Task<BaseResponse<Role_Message>> RoleIfNotExists(Guid RoleId);

    Task<BaseResponse<CommonCreateResponse>> AddRole(RoleRequest roleRequest);

    Task<BaseResponse<CommonCreateResponse>> UpdateRole(Guid id, RoleRequest roleRequest);


    Task<BaseResponse<CommonCreateResponse>> DeleteRole(Guid roleId, RoleDeleteReq deletereq);
}