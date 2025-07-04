using System.Text.Json.Serialization;

namespace Cygnux.LSP.Infrastructure.Models.Response.Lsp;

public class LspDetailResponse
{
    public Guid LspId { get; set; }
    public string LspName { get; set; } = string.Empty;
    public string? EmailId { get; set; }
    public string? MobileNo { get; set; }
    public string Alias { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public string ApiKey { get; set; } = string.Empty;
    public string ApiUrl { get; set; } = string.Empty;
    public string ApiUsername { get; set; } = string.Empty;
    public string ApiPassword { get; set; } = string.Empty;
    public string Logo { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public decimal ZipCode { get; set; }
    public string Address { get; set; } = string.Empty;
    public DateTime EntryDate { get; set; }
    public int? TotalCount { get; set; }
}

public class DownloadLsp
{
    [JsonPropertyName("Lsp Name")]
    public string LspName { get; set; } = string.Empty;

    [JsonPropertyName("Email Id")]
    public string? EmailId { get; set; }

    [JsonPropertyName("Mobile No")]
    public string? MobileNo { get; set; }

    [JsonPropertyName("Alias")]
    public string Alias { get; set; } = string.Empty;

    [JsonPropertyName("Description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("City")]
    public string City { get; set; } = string.Empty;

    [JsonPropertyName("Zip Code")]
    public decimal ZipCode { get; set; }

    [JsonPropertyName("Address")]
    public string Address { get; set; } = string.Empty;

    [JsonPropertyName("Entry Date")]
    public string EntryDate { get; set; } = string.Empty;

    [JsonPropertyName("Api Key")]
    public string ApiKey { get; set; } = string.Empty;

    [JsonPropertyName("Api Url")]
    public string ApiUrl { get; set; } = string.Empty;

    [JsonPropertyName("Api Username")]
    public string ApiUsername { get; set; } = string.Empty;

    [JsonPropertyName("Api Password")]
    public string ApiPassword { get; set; } = string.Empty;
}