using Cygnux.LSP.Application.Contracts;
using Cygnux.LSP.Application.Models.Response;
using Cygnux.LSP.Infrastructure.Contracts;

namespace Cygnux.LSP.Application.Implementations
{
    public class GeneralMasterRepository : IGeneralMasterRepository
    {
        private readonly IGeneralMasterService _generalMasterService;

        public GeneralMasterRepository(IGeneralMasterService GeneralMasterService)
        {
            _generalMasterService = GeneralMasterService;
        }

        public async Task<BaseResponse<IEnumerable<GeneralMasterResponse>>> GetGeneralMasterList(string codeType, string? searchText, CancellationToken cancellationToken)
        {
            var response = await _generalMasterService.GetGeneralMasterList(codeType, searchText, cancellationToken);

            return new BaseResponse<IEnumerable<GeneralMasterResponse>>(response);
        }
    }
}
