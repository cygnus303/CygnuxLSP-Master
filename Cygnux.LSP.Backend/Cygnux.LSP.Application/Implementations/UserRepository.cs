namespace Cygnux.LSP.Application.Implementations;

using Contracts;
using Identity.Models;
using Identity.Contracts;
using Identity.Entities;
using Infrastructure.Models.Response;
using Models.Request.Identity;
using Models.Response;

internal class UserRepository : IUserRepository
{
    private readonly IUserService _userService;

    private readonly IUserRoleService _userRoleService;

    public UserRepository(IUserService userService, IUserRoleService userRoleService)
    {
        _userService = userService;
        _userRoleService = userRoleService;
    }

    public async Task<BaseResponse<IEnumerable<UserResponse>>> GetUserList(int page, int pageSize)
    {
        var response = await _userService.GetUserList(page, pageSize);

        return new BaseResponse<IEnumerable<UserResponse>>(response, response.Select(x => x.TotalCount).FirstOrDefault());
    }

    public async Task<BaseResponse<UserResponse?>> GetUserDetails(Guid id)
    {
        var response = await _userService.GetUserDetails(id);
        return new BaseResponse<UserResponse?>(response);
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddUser(UserRequest userRequest)
    {

        var userId = Guid.NewGuid();
        var response = await _userService.AddUser(new ApplicationUser
        {
            Id = userId,
            FirstName = userRequest.FirstName,
            LastName = userRequest.LastName,
            Email = userRequest.EmailId,
            UserName = userRequest.EmailId,
            PhoneNumber = userRequest.PhoneNumber,
            EntryBy = Guid.NewGuid(),
            EntryDate = DateTime.Now,
            PasswordHash = "Admin@123",
            IsActive = true,
            IsDeleted = false
        });

        if (response.Succeeded)
        {
            await _userRoleService.UpdateUserRoles(userId, userRequest.Roles.ToList()!);
        }

        return new BaseResponse<CommonCreateResponse>(new CommonCreateResponse { Status = response.Succeeded ? 1 : 0, Message = response.Succeeded ? "User created successfully!" : response.Errors.Select(x => x.Description).FirstOrDefault() });
    }

    public async Task<BaseResponse<CommonCreateResponse>> UpdateUser(Guid id, UserRequest userRequest)
    {
        var response = await _userService.UpdateUser(id, new ApplicationUser
        {
            FirstName = userRequest.FirstName,
            LastName = userRequest.LastName,
            PhoneNumber = userRequest.PhoneNumber,
            IsActive = userRequest.IsActive
        });

        if (response.Succeeded)
        {
            await _userRoleService.UpdateUserRoles(id, userRequest.Roles.ToList()!);
        }
        return new BaseResponse<CommonCreateResponse>(new CommonCreateResponse { Status = response.Succeeded ? 1 : 0, Message = "User updated successfully!" });
    }
}