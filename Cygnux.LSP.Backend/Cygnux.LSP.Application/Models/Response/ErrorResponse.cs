namespace Cygnux.LSP.Application.Models.Response;

public class ErrorResponse
{
    public int ErrorCode { get; set; }
    public string? Message { get; set; }
    public object? Details { get; set; }
}