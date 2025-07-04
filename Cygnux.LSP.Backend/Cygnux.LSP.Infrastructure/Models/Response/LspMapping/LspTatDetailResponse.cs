using System.Text.Json.Serialization;

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
    public string ModeDescription { get; set; } = string.Empty;
    public string Modedesc {  get; set; } = string.Empty;
    public int Tat { get; set; }
    public int Priority { get; set; }
    public string PriorityDesc { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public string BookingType { get; set; } = string.Empty;
    public int? TotalCount { get; set; }
    public bool? IsCustomerMapping { get; set; }

}
public class LspTatDownloadResponse
{
    [JsonPropertyName("Customer Name")]
    public string CustomerName { get; set; } = string.Empty;

    [JsonPropertyName("Lsp Name")]
    public string LspName { get; set; } = string.Empty;

    [JsonPropertyName("Product")]
    public string Product { get; set; } = string.Empty;

    [JsonPropertyName("Origin")]
    public string Origin { get; set; } = string.Empty;

    [JsonPropertyName("Destination")]
    public string Destination { get; set; } = string.Empty;

    [JsonPropertyName("Mode Description")]
    public string ModeDescription { get; set; } = string.Empty;

    [JsonPropertyName("Tat")]
    public int Tat { get; set; }

    [JsonPropertyName("Booking Type")]
    public string BookingType { get; set; } = string.Empty;

    [JsonPropertyName("Priority")]
    public int Priority { get; set; }
}

public class DownloadLspMappingResponse
{
    public int CustomerName { get; set; }
    public int lspname { get; set; }

}
