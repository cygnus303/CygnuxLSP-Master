using Newtonsoft.Json;

namespace Cygnux.LSP.Infrastructure.Models.Response.LspMapping;

public class LspMappingDetailResponse
{
    public Guid LspMappingId { get; set; }
    public Guid CustomerId { get; set; }
    private string _lspResponse;

    public string LspResponse
    {
        get => _lspResponse;
        set
        {
            _lspResponse = value;
            // Deserialize LspIds directly into LspResponse when LspIds is set
            LspResponses = JsonConvert.DeserializeObject<List<LspRequest>>(_lspResponse);
        }
    }

    public List<LspRequest> LspResponses { get; private set; }
    public string CustomerName { get; set; } = string.Empty;
    public string LspName { get; set; } = string.Empty;

    public bool IsActive { get; set; }
    public int? TotalCount { get; set; }

}

public class LspRequest
{
    public Guid LspId { get; set; }
    public string LspName { get; set; }
}