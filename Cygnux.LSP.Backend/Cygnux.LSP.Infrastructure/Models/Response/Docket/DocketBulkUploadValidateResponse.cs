using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cygnux.LSP.Infrastructure.Models.Response.Docket
{
    public class DocketBulkUploadValidateResponse
    {
        public string CustomerName { get; set; } = string.Empty;
        public string LSPName { get; set; } = string.Empty;
        public string DocketNo { get; set; } = string.Empty;
        public string InvoiceNo { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty ;
        public string FromLocation { get; set; } = string.Empty;
        public string ToLocation { get; set; } = string.Empty;
        public int Quantity { get; set; }   
        public string ModeOfTransporter { get; set; } = string.Empty;
        public Guid Customer { get; set; }
        public Guid Lsp { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public bool ErrorCode { get; set; }  
    }
}
