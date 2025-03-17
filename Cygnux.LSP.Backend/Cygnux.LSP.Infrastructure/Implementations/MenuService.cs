namespace Cygnux.LSP.Infrastructure.Implementations;

using Constants;
using Contracts;
using Dapper;
using Models.Response;
using Models.Response.Menu;
using System.Data;

internal class MenuService : IMenuService
{
    private readonly IDbConnection _dbConnection;

    public MenuService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<MenuResponse>> GetMenuList(string userId)
    {
        var selectQuery = "select M.MenuId, M.MenuName, M.Icon, M.NavigationUrl from UserRoles UR " +
            "INNER JOIN RoleMenuPermission RMP ON RMP.RoleId = UR.RoleId " +
            "INNER JOIN Menu M ON M.MenuId = RMP.MenuId " +
            "WHERE UR.UserId = @UserId";

        return await _dbConnection.QueryAsync<MenuResponse>(
            selectQuery, new { UserId = userId });
    }

    public async Task<MenuResponse?> GetMenuDetails(Guid id)
    {
        var selectQuery = "Select * from Menu Where MenuId = @Id";
        return await _dbConnection.QueryFirstOrDefaultAsync<MenuResponse>(selectQuery, new { Id = id });
    }

    public async Task<CommonCreateResponse> AddMenu(string addMenuJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@MenuJson", addMenuJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Menu,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> UpdateMenu(Guid id, string updateMenuJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@MenuJson", updateMenuJson, DbType.String);
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Menu,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> DeleteMenu(Guid id)
    {
        var deleteQuery = "Update Menu Set IsActive = 0 Where MenuId = @Id";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "Menu deleted successfully" };
        }
        return new CommonCreateResponse();
    }
}