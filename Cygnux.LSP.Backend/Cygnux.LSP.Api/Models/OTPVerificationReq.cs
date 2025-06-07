namespace Cygnux.LSP.Api.Models;
public class OtpVerification
{
    //public Guid Id { get; set; } = Guid.NewGuid();
    //public Guid UserId { get; set; }
    //public string OTP { get; set; } = string.Empty;
    //public DateTime ExpiryTime { get; set; }
    //public bool IsUsed { get; set; } = false;
    //public DateTime CreatedAt { get; set; } = DateTime.Now;

    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string OTP { get; set; } = string.Empty;
    public string OTPLink { get; set; } = string.Empty;
    public DateTime OTPCreateTime { get; set; }
    public bool IsOTPUsed { get; set; }
    public bool IsOTPVerified { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsPasswordReset { get; set; }
    public bool IsLoggedIn { get; set; }
    public Guid EntryBy { get; set; }
    public DateTime EntryDate { get; set; }
}

public class OtpRequest
{
    public Guid UserId { get; set; }
}