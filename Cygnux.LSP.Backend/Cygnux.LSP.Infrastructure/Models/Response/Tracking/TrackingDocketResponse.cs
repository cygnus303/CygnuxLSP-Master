

namespace Cygnux.LSP.Infrastructure.Models.Response.Tracking
{
    public class TrackingDocketResponse
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
        public int? TotalCount { get; set; }
        public TrackingListTrack? track { get; set; }
        public string PODLink { get; set; } = string.Empty;
        public string DocketStatus { get; set; } = string.Empty;
        public string LatestEntryDate { get; set; } = string.Empty;

        public string ColorCode { get; set; }
        public string? StatusHistoryJson { get; set; }

        //public List<StatusHistory>? StatusHistoryJson { get; set; } = new List<StatusHistory>();

        //public List<string> StatusHistoryJson { get; set; } = new List<string>();
}

    public class TrackingListTrack
    {
        public string CodeId { get; set; } = string.Empty ;
        public string CodeDesc { get; set; } = string.Empty;
    }

    //public class StatusHistory
    //{
    //    public string DocketStatus { get; set; } = string.Empty;
    //    public string DocketStatusDesc {  get; set; } = string.Empty;
    //    public DateTime EntryDate { get; set; }
    //}
}
