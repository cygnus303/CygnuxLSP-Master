namespace CygnuxLSP.Web.Models
{
    public class CreateUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ContactNumber { get; set; }
        public string EmailId { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string EntryBy { get; set; }
        public DateTime EntryDate { get; set; }
        public bool EditFlag { get; set; }
    }
}
