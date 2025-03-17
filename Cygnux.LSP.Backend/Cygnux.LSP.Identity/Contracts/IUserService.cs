namespace Cygnux.LSP.Identity.Contracts;

using Entities;
using Microsoft.AspNetCore.Identity;
using Models;

public interface IUserService
{
    Task<IEnumerable<UserResponse>> GetUserList(int page, int pageSize);

    Task<UserResponse?> GetUserDetails(Guid id);

    Task<IdentityResult> AddUser(ApplicationUser applicationUser);

    Task<IdentityResult> UpdateUser(Guid id, ApplicationUser applicationUser);
}