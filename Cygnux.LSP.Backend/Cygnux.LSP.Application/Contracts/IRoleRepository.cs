namespace Cygnux.LSP.Application.Contracts;

using Identity.Models;
using Infrastructure.Models.Response;
using Models.Request.Role;
using Models.Response;

public interface IRoleRepository
{
    Task<BaseResponse<IEnumerable<RoleResponse>>> GetRoleList();

    Task<BaseResponse<RoleResponse?>> GetRoleDetails(Guid id);

    Task<BaseResponse<CommonCreateResponse>> AddRole(RoleRequest roleRequest);

    Task<BaseResponse<CommonCreateResponse>> UpdateRole(Guid id, RoleRequest roleRequest);
}