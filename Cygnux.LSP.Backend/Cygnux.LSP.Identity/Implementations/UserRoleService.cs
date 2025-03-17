namespace Cygnux.LSP.Identity.Implementations;

using Contracts;
using Entities;
using Microsoft.AspNetCore.Identity;

internal class UserRoleService : IUserRoleService
{
    private readonly UserManager<ApplicationUser> _userManager;

    private readonly RoleManager<ApplicationRole> _roleManager;

    public UserRoleService(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<IdentityResult> AddUserRole(Guid userId, string roleName)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            var applicationUser = new ApplicationUser() { Id = userId, Email = userId.ToString(), UserName = userId.ToString(), PasswordHash = "Admin@123" };
            return await _userManager.CreateAsync(applicationUser, applicationUser.PasswordHash!);
        }

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            var applicationRole = new ApplicationRole { Name = roleName };
            return await _roleManager.CreateAsync(applicationRole);
        }

        return await _userManager.AddToRoleAsync(user, roleName);
    }

    public async Task<IdentityResult> AddUserRole(Guid userId, string emailId, string roleName)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            var applicationUser = new ApplicationUser()
            {
                Id = userId,
                Email = emailId,
                UserName = emailId,
                PasswordHash = "Admin@123",
                EntryBy = Guid.NewGuid(),
                EntryDate = DateTime.Now,
                AccessFailedCount = 0,
                ConcurrencyStamp = "",
                EmailConfirmed = false,
                PhoneNumber = string.Empty,
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                IsActive = true
            };
            await _userManager.CreateAsync(applicationUser, applicationUser.PasswordHash!);
            user = await _userManager.FindByIdAsync(userId.ToString());
        }

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            var applicationRole = new ApplicationRole { Name = roleName };
            return await _roleManager.CreateAsync(applicationRole);
        }

        return await _userManager.AddToRoleAsync(user, roleName);
    }

    public async Task<IdentityResult> UpdateUserRoles(Guid userId, List<string> roles)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "User not found." });
        }

        // Get the current roles for the user
        var currentRoles = await _userManager.GetRolesAsync(user);

        // Remove the user from all current roles
        var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeResult.Succeeded)
        {
            return removeResult;
        }

        // Add the user to the new roles
        return await _userManager.AddToRolesAsync(user, roles);
    }
}