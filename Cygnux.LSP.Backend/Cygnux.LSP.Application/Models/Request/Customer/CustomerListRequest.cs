namespace Cygnux.LSP.Application.Models.Request.Customer;

public class CustomerListRequest
{
    public string TenantId { get; set; } = string.Empty;
    public string CustomerCode { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
}