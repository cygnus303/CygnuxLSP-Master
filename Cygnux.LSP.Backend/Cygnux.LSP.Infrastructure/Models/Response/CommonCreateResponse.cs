namespace Cygnux.LSP.Infrastructure.Models.Response;

public class CommonCreateResponse
{
    public string Message { get; set; } = string.Empty;

    public int Status { get; set; } = 0;

    public string? Id { get; set; }
}
public class GetUserId
{
    public Guid UserId { get; set; }

}

public class GetPasswordHash
{
    public required string Password { get; set; }

}
public class GetLink
{
    public string Url { get; set; } = string.Empty;

}

