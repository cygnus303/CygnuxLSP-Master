namespace Cygnux.LSP.Identity.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response;
using Entities;
using Microsoft.AspNetCore.Identity;
using Models;

public interface IUserService
{
    Task<IEnumerable<UserResponse>> GetUserList(Guid userId, string reqFilter);

    Task<UserResponse?> GetUserDetails(Guid id);

    Task<IdentityResult> AddUser(ApplicationUser applicationUser);

    Task<IdentityResult> UpdateUser(Guid id, ApplicationUser applicationUser);

    //Task<IdentityResult> DeleteUser(Guid id, DeleteUser deleteuser);
    Task<CommonCreateResponse> DeleteUser(Guid userid);
}