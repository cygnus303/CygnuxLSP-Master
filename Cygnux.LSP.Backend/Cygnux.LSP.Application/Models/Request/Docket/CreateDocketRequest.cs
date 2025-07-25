using Cygnux.LSP.Infrastructure.Implementations;

namespace Cygnux.LSP.Application.Models.Request.Docket
{
    public class CreateDocketRequest /*: UserSettings*/
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
        public Guid? UserId { get; set; }
        public Guid? CreatedBy { get; set; }
        public Guid? UpdatedBy { get; set; }
    }

    public class PODDataList
    {
        public int Id { get; set; }
        public string DocketNo { get; set; } = string.Empty;
        public Guid? CustomerId { get; set; }
        public Guid? LspId { get; set; }
        public string POD { get; set; } = string.Empty;
        public string PODFileName { get; set; } = string.Empty;
        public string PODLink { get; set; } = string.Empty;
        public string PODLinkBack { get; set; } = string.Empty;
        public string EntryBy { get; set;} = string.Empty;
      
    }

    public class DocketStatusReq
    {
        /*public Guid DocketId { get; set; }
        public string DocketNo { get; set; }= string.Empty;*/
        public string CurrentStatus { get; set; } = string.Empty;

        /*public Guid LspId { get; set; }*/
    }

    public class DocketRejectRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? Remarks { get; set; }
    }

    public class DocketPODUploadReq
    {
        /*public string DocketNo { get; set;} = string.Empty;*/
        public Guid? LspId { get; set; }
        public Guid? CustomerId { get; set; }
        public string? PODLink { get; set; } = string.Empty;
        public string PODFileName { get; set; } = string.Empty;
        public string PODLinkBack { get; set; } = string.Empty;
        public string PODFileNameBack { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; }
    }
}
