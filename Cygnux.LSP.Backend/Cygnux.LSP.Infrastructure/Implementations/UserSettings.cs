namespace Cygnux.LSP.Infrastructure.Implementations;

using Contracts;

public class UserSettings : IUserSettings
{
    private static readonly AsyncLocal<string> userId = new();

    public string UserId
    {
        get => userId.Value!;
        set => userId.Value = value;
    }

    public string UpdatedBy
    {
        get => userId.Value!;
        set => userId.Value = value;
    }

    public string CreatedBy
    {
        get => userId.Value!;
        set => userId.Value = value;
    }
}