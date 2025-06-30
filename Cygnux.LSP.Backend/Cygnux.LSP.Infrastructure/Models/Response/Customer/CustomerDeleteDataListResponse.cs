namespace Cygnux.LSP.Infrastructure.Models.Response.Customer;

public class CustomerDeleteDataRes
{
    public Guid CustomerId { get; set; }
    public string CustomerCode { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public Guid LspId { get; set; }
    public string LspName { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DocketNo { get; set; } = string.Empty;
}

public class CustomerCount
{
    public int CustCount { get; set; }
    public int ActiveCount  { get; set; }
    public int InActiveCount { get; set; }
}
