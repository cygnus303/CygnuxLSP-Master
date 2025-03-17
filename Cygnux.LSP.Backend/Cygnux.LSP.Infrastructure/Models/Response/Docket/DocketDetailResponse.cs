namespace Cygnux.LSP.Infrastructure.Models.Response.Docket
{
    public class DocketDetailResponse
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
        public int Quantity { get; set; }
    }
}
