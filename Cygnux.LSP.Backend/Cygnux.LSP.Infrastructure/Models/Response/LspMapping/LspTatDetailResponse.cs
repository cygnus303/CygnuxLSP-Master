namespace Cygnux.LSP.Infrastructure.Models.Response.LspMapping;

public class LspTatDetailResponse
{
    public Guid LspTatId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public Guid LspId { get; set; }
    public string LspName { get; set; } = string.Empty;
    public string Product { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;

    public string Destination { get; set; } = string.Empty;
    public string DestinationState { get; set; } = string.Empty;
    public string Mode { get; set; } = string.Empty;

    public int Tat { get; set; }

    public int Priority { get; set; }

    public bool IsActive { get; set; }

    public string BookingType { get; set; } = string.Empty;
    public int? TotalCount { get; set; }

}
