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
    public string EntryDate { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string PurchaseHead { get; set; } = string.Empty;
    public string PurchaseHeadMobileNo { get; set; } = string.Empty;
    public string AccountsHead { get; set; } = string.Empty;
    public string AccountsHeadMobileNo { get; set; } = string.Empty;
    public string ProprietorName { get; set; } = string.Empty;
    public string ProprietorMobileNo { get; set; } = string.Empty;
    public string ProprietorEmail { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public bool IsAllowedForEwayBillGenration { get; set; }
    public bool IsConsolidatedGSTNo { get; set; }
    public string ConsolidatedGSTNo { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string MobileNo { get; set; } = string.Empty;
}