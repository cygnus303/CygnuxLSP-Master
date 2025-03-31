using Cygnux.LSP.Infrastructure.Implementations;

namespace Cygnux.LSP.Application.Models.Request.Docket
{
    public class CreateDocketRequest : UserSettings
    {
        public Guid Id { get; set; }
        public string DocketNo { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public string FromLocation { get; set; } = string.Empty;
        public string ToLocation { get; set; } = string.Empty;
        public Guid CustomerId { get; set; }
        public string InvoiceNo { get; set; } = string.Empty;
        public string Transporter { get; set; } = string.Empty;
        public string TransportMode { get; set; } = string.Empty;
        public bool IsCancel { get; set; } 
        public int Quantity { get; set;}
        public Guid CreatedBy  { get; set; } = Guid.Empty;
        public Guid UpdatedBy { get; set; } = Guid.Empty;
    }
}
