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

public class LspMappingCount
{
    public string Name { get; set; }
    public int count { get; set; }
    public int totalCount { get; set; }
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
    public bool? IsCustomerActive { get; set; }

}

public class LspRequest
{
    public Guid LspId { get; set; }
    public string LspName { get; set; }
}

public class LspTatValidationResult
{
    public string CustomerName { get; set; }
    public string LspName { get; set; }
    public string Product { get; set; }
    public string Origin { get; set; }
    public string Destination { get; set; }
    public string DestinationState { get; set; }
    public int? Priority { get; set; }
    public string BookingType { get; set; }
    public string Mode { get; set; }
    public string TAT { get; set; }

    // Validation feedback
    public string ErrorMessage { get; set; }
    public int ErrorCode { get; set; }
}


