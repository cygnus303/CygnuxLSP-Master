namespace Cygnux.LSP.Identity.Implementations;

using Contracts;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;
using System.Data;

internal class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager)
    {
        _userManager = userManager;
    }

    public async Task<IEnumerable<UserResponse>> GetUserList(int page, int pageSize)
    {

        var query = _userManager.Users.Where(x => !x.IsDeleted);

        var totalRecords = await query.CountAsync();

        return await query
             .Skip((page - 1) * pageSize)
             .Take(pageSize)
             .Select(x => new UserResponse
             {
                 Id = x.Id,
                 FirstName = x.FirstName,
                 LastName = x.LastName,
                 EmailId = x.Email,
                 IsActive = x.IsActive,
                 PhoneNumber = x.PhoneNumber,
                 TotalCount = totalRecords
             })
             .ToListAsync();
    }

    public async Task<UserResponse?> GetUserDetails(Guid id)
    {
        var user = await _userManager.Users.Where(x => x.Id == id && !x.IsDeleted).FirstOrDefaultAsync();
        if (user is not null)
        {
            var roles = await _userManager.GetRolesAsync(user);

            return new UserResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                EmailId = user.Email,
                IsActive = user.IsActive,
                PhoneNumber = user.PhoneNumber,
                Roles = roles.ToArray()
            };
        }
        return new();
    }

    // Create a new user
    public async Task<IdentityResult> AddUser(ApplicationUser applicationUser)
    {

        var user = await _userManager.FindByEmailAsync(applicationUser.UserName ?? string.Empty);
        if (user is not null)
        {
            var error = new IdentityError { Code = "404", Description = "User already exist with same email" };
            return IdentityResult.Failed(error);
        }
        return await _userManager.CreateAsync(applicationUser, applicationUser.PasswordHash!);
    }

    // Update an existing user
    public async Task<IdentityResult> UpdateUser(Guid id, ApplicationUser applicationUser)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user != null)
        {
            user.FirstName = applicationUser.FirstName;
            user.LastName = applicationUser.LastName;
            user.PhoneNumber = applicationUser.PhoneNumber;
            user.IsActive = applicationUser.IsActive;

            return await _userManager.UpdateAsync(user);
        }

        return IdentityResult.Failed(new IdentityError { Description = "User not found" });
    }
}