namespace Cygnux.LSP.Application.Models.Request.CustomerLSPTAT;
using Infrastructure.Implementations;

public class CreateCustomerLspTatRequest : UserSettings
{
    public Guid CustomerId { get; set; }
    public Guid LspId { get; set; }
    public string? Product { get; set; }
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public string DestinationState { get; set; } = string.Empty;
    public string? Mode { get; set; }
    public int Tat { get; set; }
    public int Priority { get; set; }
    public string? BookingType { get; set; }
    public bool IsActive { get; set; }
}