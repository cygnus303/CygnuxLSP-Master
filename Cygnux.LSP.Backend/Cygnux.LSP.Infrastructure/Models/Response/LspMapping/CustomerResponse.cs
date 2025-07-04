using System.Text.Json.Serialization;

namespace Cygnux.LSP.Infrastructure.Models.Response.LspMapping
{
    public class CustomerResponse
    {
        public Guid CustomerId { get; set; } 
        public string CustomerName { get; set; } = string.Empty;
    }

public class DownloadCustomerResponse
    {
        [JsonPropertyName("CustomerName")]
        public string CustomerName { get; set; }

        [JsonPropertyName("CustomerCode")]
        public string CustomerCode { get; set; }

        [JsonPropertyName("EmailId")]
        public string EmailId { get; set; }

        [JsonPropertyName("Address")]
        public string Address { get; set; }

        [JsonPropertyName("City")]
        public string City { get; set; }

        [JsonPropertyName("Pincode")]
        public string Pincode { get; set; }

        [JsonPropertyName("State")]
        public string State { get; set; }

        [JsonPropertyName("Country")]
        public string Country { get; set; }

        [JsonPropertyName("PurchaseHead")]
        public string PurchaseHead { get; set; }

        [JsonPropertyName("PurchaseHeadMobileNo")]
        public string PurchaseHeadMobileNo { get; set; }

        [JsonPropertyName("AccountsHeadMobileNo")]
        public string AccountsHeadMobileNo { get; set; }

        [JsonPropertyName("ProprietorEmail")]
        public string ProprietorEmail { get; set; }

        [JsonPropertyName("ProprietorMobileNo")]
        public string ProprietorMobileNo { get; set; }

        [JsonPropertyName("FirstName")]
        public string FirstName { get; set; }

        [JsonPropertyName("LastName")]
        public string LastName { get; set; }

        [JsonPropertyName("MobileNo")]
        public string MobileNo { get; set; }
    }

}
