using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cygnux.LSP.Application.Models.Response
{
    public class GeneralMasterResponse
    {
        public string CodeType { get; set; } = string.Empty;
        public string CodeId { get; set; } = string.Empty;

        public string CodeDesc { get; set; } = string.Empty;
    }
}
