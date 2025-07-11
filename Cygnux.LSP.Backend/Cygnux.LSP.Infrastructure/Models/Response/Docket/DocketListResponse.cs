using System.Text.Json.Serialization;

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
        public bool? IsLspTatActive { get; set;}
        public bool? IsLSPCancelled { get; set; }
        public bool? IsCustomerCancelled { get; set; }

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

    public class TrackingChartResponse
    {
        public string TransportMode { get; set; }
        public int TotalCount { get; set; }
        public int Count { get; set; }
    }

    public class DownloadDocketResponse
    {
        [JsonPropertyName("Docket No")]
        public string DocketNo { get; set; } = string.Empty;

        [JsonPropertyName("Booking Date")]
        public string BookingDate { get; set; } = string.Empty;

        [JsonPropertyName("From Location")]
        public string FromLocation { get; set; } = string.Empty;

        [JsonPropertyName("To Location")]
        public string ToLocation { get; set; } = string.Empty;

        [JsonPropertyName("Customer Name")]
        public string CustomerName { get; set; } = string.Empty;

        [JsonPropertyName("Invoice No")]
        public string InvoiceNo { get; set; } = string.Empty;

        [JsonPropertyName("Transporter")]
        public string TransporterDesc { get; set; } = string.Empty;

        [JsonPropertyName("Transport Mode")]
        public string TransportModeDesc { get; set; } = string.Empty;

        [JsonPropertyName("Quantity")]
        public int Quantity { get; set; }

        [JsonPropertyName("Current Status")]
        public string CurrentStatusDesc { get; set; } = string.Empty;

    }

    public class DownloadPODResponse
    {
        public string DocketNo { get; set; }
        public string Transporter { get; set; }
        public string TransporterDesc { get; set; }
        public string PODLink { get; set; }

    }


}
