using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cygnux.LSP.Infrastructure.Models.Response.Docket
{
    public class LspTATData
    {
        public string? FromLocation { get; set; }
        public string? ToLocation { get; set; }
        public Guid CustomerId { get; set; }
        public Guid LspId { get; set; }
        public string? Mode { get; set; }
    }

    public class LspTATData_Docket
    {
        public Guid LspId { get; set; }
        public string LSPName{ get; set; }
        public int TAT { get; set; }
        public decimal RatePerKG { get; set; }
        public decimal Amount { get; set; }
    }
}
