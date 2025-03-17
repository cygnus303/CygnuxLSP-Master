namespace Cygnux.LSP.Infrastructure.Models.Response.Customer;

public class CustomerDetailResponse
{
    public Guid CustomerId { get; set; }
    public string TenantId { get; set; } = string.Empty;
    public string CustomerCode { get; set; } = string.Empty;

    public string CustomerName { get; set; } = string.Empty;

    public string EmailId { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;

    public bool IsAllowedForEwayBillGenration { get; set; }
    public bool IsConsolidatedGSTNo { get; set; }
    public string ConsolidatedGSTNo { get; set; } = string.Empty;
}