
namespace Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
public class DeleteCutomerLSPData
{
    public Guid CustomerLspMapId { get; set; }
    public Guid CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? LspId { get; set; }
    public string? LspName { get; set; }
    public Guid TatId { get; set; }
    public string? Origin { get; set; }
    public string? Destination { get; set; }
    public string? DocketNo { get; set; }
}

public class DeleteCustomerLspTatDetail
{
    public Guid TATId { get; set; }
    public Guid CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public Guid LspId { get; set; }
    public string? LspName { get; set; }
    public string? Origin { get; set; }
    public string? Destination { get; set; }
    public string? DocketNo { get; set; }
}
