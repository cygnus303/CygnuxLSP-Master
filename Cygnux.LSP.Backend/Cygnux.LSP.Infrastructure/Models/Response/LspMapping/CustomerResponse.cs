namespace Cygnux.LSP.Infrastructure.Models.Response.LspMapping
{
    public class CustomerResponse
    {
        public Guid CustomerId { get; set; } 
        public string CustomerName { get; set; } = string.Empty;
    }

    public class DownloadCustomerResponse
    {
        public string CustomerName { get; set; }
        public string CustomerCode { get; set; }
        public string EmailId { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Pincode { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PurchaseHead { get; set; }
        public string PurchaseHeadMobileNo { get; set; }
        public string AccountsHeadMobileNo { get; set; }
        public string ProprietorEmail { get; set; }
        public string ProprietorMobileNo { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MobileNo { get; set; }
    }
}
