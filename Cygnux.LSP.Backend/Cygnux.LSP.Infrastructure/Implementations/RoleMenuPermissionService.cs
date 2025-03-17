namespace Cygnux.LSP.Infrastructure.Implementations;

using Constants;
using Contracts;
using Dapper;
using Models.Response;
using Models.Response.RoleMenuPermission;
using System.Data;

internal class RoleMenuPermissionService : IRoleMenuPermissionService
{
    private readonly IDbConnection _dbConnection;

    public RoleMenuPermissionService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<RoleMenuPermissionResponse>> GetRoleMenuPermissionList()
    {
        return await _dbConnection.QueryAsync<RoleMenuPermissionResponse>("select * from RoleMenuPermission");
    }

    public async Task<RoleMenuPermissionResponse?> GetRoleMenuPermissionDetails(Guid roleId, Guid menuId)
    {
        var selectQuery = "Select * from RoleMenuPermission Where RoleId = @RoleId AND MenuId = @MenuId";
        return await _dbConnection.QueryFirstOrDefaultAsync<RoleMenuPermissionResponse>(selectQuery, new { RoleId = roleId, MenuId = menuId });
    }

    public async Task<IEnumerable<RoleMenuPermissionResponse>> GetMenuPermissionByRole(Guid roleId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@RoleId", roleId, DbType.Guid);

        return await _dbConnection.QueryAsync<RoleMenuPermissionResponse>(
            StoredProcedureConstants.Usp_GetMenuPermission,
            param: parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<CommonCreateResponse> AddRoleMenuPermission(Guid roleId, string addRoleMenuPermissionJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@RoleId", roleId, DbType.Guid);
        parameters.Add("@RoleMenuPermissionJson", addRoleMenuPermissionJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_RoleMenuPermission,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> UpdateRoleMenuPermission(Guid id, string updateRoleMenuPermissionJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@RoleMenuPermissionJson", updateRoleMenuPermissionJson, DbType.String);
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_RoleMenuPermission,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> DeleteRoleMenuPermission(Guid id)
    {
        var deleteQuery = "Update RoleMenuPermission Set IsActive = 0 Where RoleMenuPermissionId = @Id";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "RoleMenuPermission deleted successfully" };
        }
        return new CommonCreateResponse();
    }
}