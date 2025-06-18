namespace Cygnux.LSP.Identity.Implementations;

using Contracts;
using Cygnux.LSP.Infrastructure.Constants;
using Cygnux.LSP.Infrastructure.Models.Response;
using Dapper;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Models;
using System.Data;
using System.Data.Common;

internal class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IDbConnection _dbConnection;


    public UserService(UserManager<ApplicationUser> userManager,
    RoleManager<ApplicationRole> roleManager,
    IConfiguration configuration)
    {
        _userManager = userManager;

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        _dbConnection = new SqlConnection(connectionString); // ✅ SqlConnection from System.Data.SqlClient
    }



    public async Task<IEnumerable<UserResponse>> GetUserList(Guid userId, string reqFilter)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userId, DbType.Guid);
        parameters.Add("@jsonreqst", reqFilter, DbType.String);

        return await _dbConnection.QueryAsync<UserResponse>(
            StoredProcedureConstants.USP_GetUserList,
            parameters,
            commandType: CommandType.StoredProcedure
        );
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
            user.City = applicationUser.City;
            user.CustomerName = applicationUser.CustomerName;
            user.Location = applicationUser.Location;
            user.Locality = applicationUser.Locality;
            user.UserType = applicationUser.UserType;
            user.Address = applicationUser.Address;
            user.SessionTime = applicationUser.SessionTime;
            user.ZipCode = applicationUser.ZipCode;
            user.Email = applicationUser.Email;

            return await _userManager.UpdateAsync(user);
        }

        return IdentityResult.Failed(new IdentityError { Description = "User not found" });
    }

    public async Task<CommonCreateResponse> DeleteUser(Guid userid)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@UserId", userid, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
              StoredProcedureConstants.USP_DeleteUserAndRelations,
              param: parameters,
              commandType: CommandType.StoredProcedure
          ) ?? new CommonCreateResponse();
    }
  
    public async Task<GetPasswordHash> UpdatePassword(Guid id, string password)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());

        if (user != null)
        {
            // Hash the password using the password hasher
            var hashedPassword = _userManager.PasswordHasher.HashPassword(user, password);

            // Set the hashed password
            user.PasswordHash = hashedPassword;

            // Update the user in the database
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return new GetPasswordHash
                {
                    Password = hashedPassword
                };
            }
        }

        // If user not found or update failed, return empty object or throw based on your logic
        return new GetPasswordHash
        {
            Password = string.Empty // or "Error"
        };
    }

    public async Task<CommonCreateResponse> GetOldPasswordHash(Guid userid, string oldpassword)
    {
        var user = await _userManager.FindByIdAsync(userid.ToString());

        if (user != null)
        {
            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                return new CommonCreateResponse
                {
                    Status = 0,
                    Message = "Stored password hash is missing"
                };
            }

            var verificationResult = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, oldpassword);

            if (verificationResult == PasswordVerificationResult.Success)
            {
                return new CommonCreateResponse
                {
                    Status = 1,
                    Message = "Old password is correct",
                    Id = user.PasswordHash
                };
            }
            else
            {
                return new CommonCreateResponse
                {
                    Status = 0,
                    Message = "Old password is incorrect"
                };
            }
        }

        return new CommonCreateResponse
        {
            Status = 0,
            Message = "User not found"
        };
    }

    public async Task<GetUserId> GetUserFromEmailId(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user != null)
        {
            return new GetUserId
            {
                Status = 1,
                Message = "User found",
                UserId = user.Id
            };
        }
        else
        {
            return new GetUserId
            {
                Status = 0,
                Message = "User not found"
            };
        }
    }


}