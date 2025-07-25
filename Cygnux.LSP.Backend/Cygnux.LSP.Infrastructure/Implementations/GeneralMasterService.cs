using Cygnux.LSP.Application.Models.Response;
using Cygnux.LSP.Infrastructure.Constants;
using Cygnux.LSP.Infrastructure.Contracts;
using Dapper;
using System.Data;

namespace Cygnux.LSP.Infrastructure.Implementations
{
    public class GeneralMasterService : IGeneralMasterService
    {
        private readonly IDbConnection _dbConnection;

        public GeneralMasterService(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        public async Task<IEnumerable<GeneralMasterResponse>> GetGeneralMasterList(string codeType, string? searchText, CancellationToken cancellationToken)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CodeType", codeType, DbType.String);
            if (!string.IsNullOrWhiteSpace(searchText))
            {
                parameters.Add("@SearchText", searchText, DbType.String);
            }
            return await _dbConnection.QueryAsync<GeneralMasterResponse>(
                 StoredProcedureConstants.Usp_GetGeneralMaster,
                 parameters,
                 commandType: CommandType.StoredProcedure
             );
        }
    }
}
