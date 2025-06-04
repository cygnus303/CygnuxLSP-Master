namespace Cygnux.LSP.Infrastructure.Models.Response.Docket
{
    public class DocketListResponse /*: DocketDetailResponse*/
    {
        /*public Guid Id { get; set; }*/
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
        public int? TotalCount { get; set; }
        public TrackingList? track {  get; set; }
        public string PODLink { get; set; } = string.Empty;

    }

    public class TrackingList
    {
        public string CodeId { get; set; } 
        public string CodeDesc { get; set; } 
    }

    public class DocList
    {
         public string BookingDate { get; set; }
        public string LspName { get; set; }
        public string FromLocation { get; set; }
        public string ToLocation { get; set; }
        public string Transporter { get; set; }

    }

    public class Trackinglist
    {
        public string Name { get; set; }
        public int Count { get; set; }
        public int TotalCount { get; set; }
    }
}
