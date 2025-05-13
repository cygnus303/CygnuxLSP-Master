using Cygnux.LSP.Infrastructure.Implementations;

namespace Cygnux.LSP.Application.Models.Request.Docket
{
    public class CreateDocketRequest : UserSettings
    {
        public string DocketNo { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public string FromLocation { get; set; } = string.Empty;
        public string ToLocation { get; set; } = string.Empty;
        public Guid CustomerId { get; set; }
        public string InvoiceNo { get; set; } = string.Empty;
        public string Transporter { get; set; } = string.Empty;
        public string TransportMode { get; set; } = string.Empty;
        public Guid LspId { get; set; }
        public int Quantity { get; set;}
        public bool IsCancel { get; set; }
        public string CurrentStatus { get; set; } = string.Empty;
    }

    public class PODDataList
    {
        public int Id { get; set; }
        public string DocketNo { get; set; }
        public DateTime UploadDate { get; set; }
        public string ImageLink { get; set; } // store server path like /UploadedImages/ABC121.png
        public string? LSPName { get; set; }
        //public byte[] ImagePath { get; set; }
    }

    public class DocketStatusReq
    {
        /*public Guid DocketId { get; set; }
        public string DocketNo { get; set; }= string.Empty;*/
        public string CurrentStatus { get; set; } = string.Empty;

        /*public Guid LspId { get; set; }*/
    }
}
