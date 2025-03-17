namespace Cygnux.LSP.Infrastructure.Implementations;

using Constants;
using Contracts;
using Dapper;
using Models.Response;
using Models.Response.Docket;
using System.Data;

internal class DocketService : IDocketService
{
    private readonly IDbConnection _dbConnection;

    public DocketService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<DocketListResponse>> GetDocketList(int page, int pageSize)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Page", page, DbType.Int32);
        parameters.Add("@PageSize", pageSize, DbType.Int32);

        return await _dbConnection.QueryAsync<DocketListResponse>(
             StoredProcedureConstants.Usp_GetDocket,
             parameters,
             commandType: CommandType.StoredProcedure
         );
    }

    public async Task<DocketDetailResponse> GetDocketDetails(Guid docketId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", docketId, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<DocketDetailResponse>(
            StoredProcedureConstants.Usp_GetDocket,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new DocketDetailResponse();
    }
    public async Task<CommonCreateResponse> ImportDocket(string addDocketsJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@DocketJson", addDocketsJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_ImportDocket,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> AddDocket(string addDocketJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@DocketJson", addDocketJson, DbType.String);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
            StoredProcedureConstants.Usp_Docket,
            param: parameters,
            commandType: CommandType.StoredProcedure
        ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> UpdateDocket(Guid id, string updateDocketJson)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@DocketJson", updateDocketJson, DbType.String);
        parameters.Add("@Id", id, DbType.Guid);

        return await _dbConnection.QueryFirstOrDefaultAsync<CommonCreateResponse>(
              StoredProcedureConstants.Usp_Docket,
              param: parameters,
              commandType: CommandType.StoredProcedure
          ) ?? new CommonCreateResponse();
    }

    public async Task<CommonCreateResponse> DeleteDocket(Guid id)
    {
        var deleteQuery = "Update Docket Set IsDeleted = 1 Where Id = @Id";
        var rowAffected = await _dbConnection.ExecuteAsync(deleteQuery, new { Id = id });
        if (rowAffected > 0)
        {
            return new CommonCreateResponse { Status = 1, Message = "Docket deleted successfully" };
        }
        return new CommonCreateResponse();
    }
}