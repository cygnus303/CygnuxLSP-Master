using Newtonsoft.Json;

namespace Cygnux.LSP.Infrastructure.Models.Response.LspMapping;

public class LspMappingDetailResponse
{
    public Guid LspMappingId { get; set; }
    public Guid CustomerId { get; set; }
    public string LspId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string LspName { get; set; } = string.Empty;
    public string SupportEmail { get; set; } = string.Empty;
    public bool IsActive { get; set; }

}


public class LspMappingListResponse
{
    public Guid LspMappingId { get; set; }
    public Guid CustomerId { get; set; }
   
    public string CustomerName { get; set; } = string.Empty;
    public string LspName { get; set; } = string.Empty;

    public string SupportEmail { get; set; } = string.Empty;
    public bool IsDeleted { get; set; } 
    public bool IsActive { get; set; }
    public int? TotalCount { get; set; }
    public required string LspId { get; set; }

}

public class LspRequest
{
    public Guid LspId { get; set; }
    public string LspName { get; set; }
}