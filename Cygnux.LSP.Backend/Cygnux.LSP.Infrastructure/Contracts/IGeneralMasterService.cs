using Cygnux.LSP.Application.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cygnux.LSP.Infrastructure.Contracts
{
    public interface IGeneralMasterService
    {
        Task<IEnumerable<GeneralMasterResponse>> GetGeneralMasterList(string codeType, string? searchText, CancellationToken cancellationToken);
    }
}
