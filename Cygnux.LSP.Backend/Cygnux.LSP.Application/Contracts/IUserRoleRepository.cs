namespace Cygnux.LSP.Application.Contracts;

using Infrastructure.Models.Response;
using Models.Response;

public interface IUserRoleRepository
{
    Task<BaseResponse<CommonCreateResponse>> AddUserRole(Guid userId, string roleName);

    Task<BaseResponse<CommonCreateResponse>> UpdateUserRoles(Guid userId, List<string> roles);
}