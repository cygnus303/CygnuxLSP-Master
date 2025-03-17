using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CygnuxLSP.Model.Domain
{
    public class LC_Customer_Master
    {
        public string TenantId { get; set; }
        public string CustomerCode { get; set; }
        public string CustomerName { get; set; }
        public string EmailId { get; set; }
        public string Address { get; set; }
        public string PurchaseHead { get; set; }
        public string PurchaseHead_MobileNo { get; set; }
        public string AccountsHead { get; set; }
        public string AccountsHead_MobileNo { get; set; }
        public string ProprietorName { get; set; }
        public string Proprietor_MobileNo { get; set; }
        public string Proprietor_Email { get; set; }
        public string Pincode { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Active { get; set; }
        public string Channel { get; set; }
        public string Region { get; set; }
        public string Brand { get; set; }
        public string SubBrand { get; set; }
        public string CustomerGroup { get; set; }
        public string EWAY_Bill { get; set; }
        public string EWAY_GSTINNo { get; set; }
        public string Business_Classification { get; set; }
        public string EntryBy { get; set; }
        public DateTime EntryDate { get; set; }
        public string Updateby { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}
