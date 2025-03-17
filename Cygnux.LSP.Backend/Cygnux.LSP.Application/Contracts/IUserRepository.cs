namespace Cygnux.LSP.Application.Contracts;

using Identity.Models;
using Infrastructure.Models.Response;
using Models.Request.Identity;
using Models.Response;

public interface IUserRepository
{
    Task<BaseResponse<IEnumerable<UserResponse>>> GetUserList(int page, int pageSize);

    Task<BaseResponse<UserResponse?>> GetUserDetails(Guid id);

    Task<BaseResponse<CommonCreateResponse>> AddUser(UserRequest userRequest);

    Task<BaseResponse<CommonCreateResponse>> UpdateUser(Guid id, UserRequest userRequest);
}