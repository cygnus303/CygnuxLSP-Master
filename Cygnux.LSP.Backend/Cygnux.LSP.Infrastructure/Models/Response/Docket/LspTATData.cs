using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cygnux.LSP.Infrastructure.Models.Response.Docket
{
    public class LspTATData
    {
        public string? Location { get; set; }
        public Guid CustomerId { get; set; }
        public string LspId {  get; set; } = string.Empty;
    }   
}
