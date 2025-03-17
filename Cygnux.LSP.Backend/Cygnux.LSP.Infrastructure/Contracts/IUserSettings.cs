namespace Cygnux.LSP.Infrastructure.Contracts;

public interface IUserSettings
{
    string UserId { get; set; }

    string CreatedBy { get; set; }
    string UpdatedBy { get; set; }
}