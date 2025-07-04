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
        [JsonPropertyName("Customer Name")]
        public string CustomerName { get; set; }

        [JsonPropertyName("Customer Code")]
        public string CustomerCode { get; set; }

        [JsonPropertyName("Email Id")]
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

        [JsonPropertyName("Purchase Head")]
        public string PurchaseHead { get; set; }

        [JsonPropertyName("Purchase Head Mobile No")]
        public string PurchaseHeadMobileNo { get; set; }

        [JsonPropertyName("Accounts Head Mobile No")]
        public string AccountsHeadMobileNo { get; set; }

        [JsonPropertyName("Proprietor Email")]
        public string ProprietorEmail { get; set; }

        [JsonPropertyName("Proprietor Mobile No")]
        public string ProprietorMobileNo { get; set; }

        [JsonPropertyName("First Name")]
        public string FirstName { get; set; }

        [JsonPropertyName("Last Name")]
        public string LastName { get; set; }

        [JsonPropertyName("Mobile No")]
        public string MobileNo { get; set; }
    }

}
