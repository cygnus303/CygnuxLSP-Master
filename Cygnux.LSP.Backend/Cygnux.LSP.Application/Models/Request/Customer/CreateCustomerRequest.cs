namespace Cygnux.LSP.Application.Models.Request.Customer;
using Infrastructure.Implementations;

public class CreateCustomerRequest : UserSettings
{
    public string CustomerCode { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string U_Id { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string PurchaseHead { get; set; } = string.Empty;
    public string PurchaseHeadMobileNo { get; set; } = string.Empty;
    public string AccountsHeadMobileNo { get; set; } = string.Empty;
    public string AccountsHead { get; set; } = string.Empty;
    public bool? IsAllowedForEwayBillGenration { get; set; } = false;
    public bool? IsActive { get; set; } = false;
    public bool? IsConsolidatedGSTNo { get; set; } = false;
    public string ConsolidatedGSTNo { get; set; } = string.Empty;
    public string ProprietorName { get; set; } = string.Empty;
    public string ProprietorMobileNo { get; set; } = string.Empty;
    public string ProprietorEmail { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string MobileNo { get; set; } = string.Empty;
    public string ColorCode { get; set; } = string.Empty;
    public string LogoLink { get; set; } = string.Empty;
    public Guid EntryBy { get; set; }

}