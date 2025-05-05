namespace Cygnux.LSP.Application.Models.Request.LspMapping;

using Infrastructure.Implementations;

public class CreateLspMappingRequest : UserSettings
{
    public Guid CustomerId { get; set; }
    /*public string[] LspIds { get; set; }*/
    /*public required Guid LspId { get; set; }*/
    public required string LspId { get; set; }
    public bool? IsActive { get; set; }
    public string SupportEmail { get; set; } = string.Empty;

    /*public Guid? LspMapId { get; set; }*/
}



