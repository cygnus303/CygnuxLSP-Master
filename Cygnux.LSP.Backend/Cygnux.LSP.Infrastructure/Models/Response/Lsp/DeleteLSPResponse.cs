using System.Net;

namespace Cygnux.LSP.Infrastructure.Models.Response.Lsp;
public class DeleteLSPDataResponse
{
    //public CustomerLSPData? CustomerLSPData { get; set; }
    //public CustomerLspTatData? CustomerLspTatData { get; set; }
    //public LSPDocketData? LSPDocketData { get; set; }
    public List<CustomerLSPData> CustomerMappings { get; set; } = new();
    public List<CustomerLspTatData> TatDetails { get; set; } = new();
    public List<LSPDocketData> Dockets { get; set; } = new();
    public bool Status { get; set; }
    public string? Message { get; set; }

}

public class CustomerLSPData
{
    public Guid? CustomerId { get; set; }
    public string? CustomerName { get; set; } 
    public Guid? LspId { get; set; }
    public string? LspName { get; set; }

}

public class CustomerLspTatData
{
    public Guid? LspId { get; set; }
    public string? LspName { get; set; }
    public string? Origin { get; set; }
    public string? Destination { get;set; }
}

public class LSPDocketData
{
    public string? DocketNo { get; set; }
    public string? Transporter {  get; set; }
}

public class StatusResult
{
    public bool Status { get; set; }
    public string Message { get; set; }
}