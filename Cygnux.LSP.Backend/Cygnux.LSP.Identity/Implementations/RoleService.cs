namespace Cygnux.LSP.Identity.Implementations;

using Contracts;
using Cygnux.LSP.Infrastructure.Constants;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Dapper;
//using Cygnux.LSP.Infrastructure.Constants;
//using Cygnux.LSP.Infrastructure.Models.Response;
//using Dapper;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;
using System.Data;
using System.Data.Common;

internal class RoleService : IRoleService
{
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly IDbConnection _dbConnection;

    public RoleService(RoleManager<ApplicationRole> roleManager, IDbConnection dbConnection)
    {
        _roleManager = roleManager;
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<RoleResponse>> GetRoleList(string reqFilter)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@JsonRequest", reqFilter, DbType.String);

        return await _dbConnection.QueryAsync<RoleResponse>(
             StoredProcedureConstants.USP_RoleList,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }


    public async Task<RoleResponse?> GetRoleDetails(Guid id)
    {
        return await _roleManager.Roles.Where(x => x.Id == id)
            .Select(x => new RoleResponse
            {
                Id = x.Id,
                RoleName = x.Name,
                IsActive = x.IsActive
            }).FirstOrDefaultAsync();
    }

    public async Task<IdentityResult> AddRole(ApplicationRole applicationRole)
    {
        if (string.IsNullOrWhiteSpace(applicationRole.Name))
        {
            return IdentityResult.Failed(new IdentityError { Description = "Role name cannot be empty." });
        }

        var roleExists = await _roleManager.RoleExistsAsync(applicationRole.Name);
        if (roleExists)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Role already exists." });
        }

        return await _roleManager.CreateAsync(new ApplicationRole() { Name = applicationRole.Name, IsActive = applicationRole.IsActive, EntryBy = Guid.NewGuid(), EntryDate = DateTime.Now });
    }

    public async Task<IdentityResult> UpdateRole(Guid roleId, ApplicationRole applicationRole)
    {
        var role = await _roleManager.FindByIdAsync(roleId.ToString());
        if (role == null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Role not found." });
        }
        role.Name = applicationRole.Name;
        role.IsActive = applicationRole.IsActive;
        return await _roleManager.UpdateAsync(role);
    }

    public async Task<IdentityResult> DeleteRole(Guid roleId, DeleteRole deleterole)
    {
        var role = await _roleManager.FindByIdAsync(roleId.ToString());
        if (role == null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Role not found." });
        }
      
        role.IsDeleted = deleterole.IsDeleted;
        return await _roleManager.UpdateAsync(role);
    }

  
}