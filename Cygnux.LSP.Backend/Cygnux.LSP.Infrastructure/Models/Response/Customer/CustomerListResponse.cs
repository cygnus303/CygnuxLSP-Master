namespace Cygnux.LSP.Infrastructure.Models.Response.Customer;

public class CustomerListResponse : CustomerDetailResponse
{
    public string EntryBy { get; set; } = string.Empty;
    public DateTime EntryDate { get; set; }
    public int? TotalCount { get; set; }
}