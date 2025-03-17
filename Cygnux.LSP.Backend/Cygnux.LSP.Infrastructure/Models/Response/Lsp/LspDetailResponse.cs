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

    public int? TotalCount { get; set; }
}