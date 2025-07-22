namespace Cygnux.LSP.Infrastructure.Models.Response.Docket
{
    public class DocketDetailResponse
    {
        public Guid DocketId { get; set; }
        public string DocketNo { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public string FromLocation { get; set; } = string.Empty;
        public string ToLocation { get; set; } = string.Empty;
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string InvoiceNo { get; set; } = string.Empty;
        public string Transporter { get; set; } = string.Empty;
        public string TransporterDesc { get; set; } = string.Empty;
        public string TransportMode { get; set; } = string.Empty;
        public string TransportModeDesc { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public Guid EntryBy { get; set; }
        public DateTime EntryDate { get; set; }
        public string CurrentStatus { get; set; } = string.Empty;
        public string CurrentStatusDesc { get; set; } = string.Empty;
        public string PODLink { get; set;} = string.Empty;
    }

    public class City_Master
    {
        public string Location { get; set; }
    }

    public class State_Master
    {
        public string stcd { get; set; }
        public string stnm { get; set; }
    }
}
