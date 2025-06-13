namespace Cygnux.LSP.Application.Contracts;

using Identity.Models;
using Infrastructure.Models.Response;
using Models.Request.Identity;
using Models.Response;

public interface IUserRepository
{
    Task<BaseResponse<IEnumerable<UserResponse>>> GetUserList(Guid userId, Dictionary<string, string> reqFilter);

    Task<BaseResponse<UserResponse?>> GetUserDetails(Guid id);

    Task<BaseResponse<CommonCreateResponse>> AddUser(UserRequest userRequest, Guid user);

    Task<BaseResponse<CommonCreateResponse>> UpdateUser(Guid id, UserRequest userRequest);

    //Task<BaseResponse<CommonCreateResponse>> DeleteUser(Guid id, DeleteUserReq deleteUreq);

    Task<BaseResponse<CommonCreateResponse>> DeleteUser(Guid userid);
    Task<BaseResponse<GetPasswordHash>> UpdatePassword(Guid id, string password);
    
}