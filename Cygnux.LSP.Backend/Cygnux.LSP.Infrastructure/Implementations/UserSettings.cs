namespace Cygnux.LSP.Infrastructure.Implementations;

using Contracts;
using System.Text.Json.Serialization;

public class UserSettings : IUserSettings
{
    private static readonly AsyncLocal<string> userId = new();
    [JsonIgnore]
    public string? UserId
    {
        get => userId.Value!;
        set => userId.Value = value;
    }
    [JsonIgnore]
    public string? UpdatedBy
    {
        get => userId.Value!;
        set => userId.Value = value;
    }
    [JsonIgnore]
    public string? CreatedBy
    {
        get => userId.Value!;
        set => userId.Value = value;
    }
}