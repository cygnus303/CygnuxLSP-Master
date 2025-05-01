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

   public async Task<IEnumerable<UserResponse>> GetUserList(int page, int pageSize, Guid userId, string firstName, string emailId, string phoneNumber)
{
    var user = await _userManager.FindByIdAsync(userId.ToString());
    var roles = await _userManager.GetRolesAsync(user);

    var query = _userManager.Users.Where(x => !x.IsDeleted);

    if (!roles.Contains("SA"))
    {
        query = query.Where(x => x.Id == userId);
    }

        if (!string.IsNullOrEmpty(firstName) || !string.IsNullOrEmpty(emailId) || !string.IsNullOrEmpty(phoneNumber))
        {
            if (!string.IsNullOrEmpty(firstName))
                query = query.Where(x => x.FirstName.Contains(firstName));

            if (!string.IsNullOrEmpty(emailId))
                query = query.Where(x => x.Email.Contains(emailId));

            if (!string.IsNullOrEmpty(phoneNumber))
                query = query.Where(x => x.PhoneNumber.Contains(phoneNumber));
        }


        var totalRecords = await query.CountAsync();
          //var query = _userManager.Users.Where(x => !x.IsDeleted && x.Id == userId);

        //var totalRecords = await query.CountAsync();

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
            City = x.City,
            CustomerName = x.CustomerName,
            Location = x.Location,
            UserType = x.UserType,
            Locality = x.Locality,
            Address = x.Address,
            ZipCode = x.ZipCode,
            SessionTime = x.SessionTime,
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
            string rolesAsString = string.Join(", ", roles);
            return new UserResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                EmailId = user.Email,
                IsActive = user.IsActive,
                PhoneNumber = user.PhoneNumber,
                City = user.City,
                CustomerName = user.CustomerName,
                Location = user.Location,
                UserType = user.UserType,
                Locality = user.Locality,
                Address = user.Address,
                ZipCode = user.ZipCode,
                SessionTime = user.SessionTime,
                Roles = rolesAsString,
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

    public async Task<IdentityResult> DeleteUser(Guid id, DeleteUser deleteuser)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "User not found." });
        }

        user.IsDeleted = deleteuser.IsDeleted;
        return await _userManager.UpdateAsync(user);
    }
}