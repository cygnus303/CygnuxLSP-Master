namespace Cygnux.LSP.Infrastructure.Models.Response.LspMapping
{
    public class LspResponse
    {
        public Guid LspId { get; set; }
        public string LspName { get; set; } = string.Empty;
        public string LSPCode { get; set; } = string.Empty;
    }
}
