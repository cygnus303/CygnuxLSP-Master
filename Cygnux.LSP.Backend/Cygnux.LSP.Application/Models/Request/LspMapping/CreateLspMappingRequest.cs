namespace Cygnux.LSP.Application.Models.Request.LspMapping;

using Infrastructure.Implementations;

public class CreateLspMappingRequest : UserSettings
{
    public Guid CustomerId { get; set; }
    public string[] LspIds { get; set; }

    public Guid LspId { get; set; }
    public bool? IsActive { get; set; }
}



