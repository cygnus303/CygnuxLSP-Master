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
    public Guid RequestId { get; set; }
    public bool IsMailSend { get; set; }
}

public class OtpRequest
{
    public Guid UserId { get; set; }
}
public class OtpVerifyRequest
{
    public Guid RequestId { get; set; }
    public string? Email { get; set; } = string.Empty;
    public required string OTP { get; set; }
}
public class OtpResendRequest
{
    public Guid RequestId { get; set; }
    public string? EmailId { get; set; } = string.Empty;
}

public class OtpResendValidationResponse
{
    public bool Status { get; set; }        
    public string Message { get; set; } = string.Empty;
    public Guid UserId { get; set; }
}
public class PasswordResetRequest
{
    public Guid? RequestId { get; set; }
    public Guid? UserId { get; set; }
    public string? OldPassword { get; set; }
    public required string NewPassword { get; set; }
}

public class ChangePasswordRequest
{
   
    public Guid UserId { get; set; }
    public required string OldPassword { get; set; }
    public required string NewPassword { get; set; }
}
public class ResendMailReq
{
    public Guid UserId { get; set; }
    public required string EmailId { get; set; }
}


public class ResendEmailUpdate
{
    public Guid UserId { get; set; }
    public string OTP { get; set; } = string.Empty;
    public DateTime OTPCreateTime { get; set; }
    public Guid ResendMailBy { get; set; }
    public bool IsResendMail { get; set; }
}
public class ForgotPasswordRequest
{
    public required string Email { get; set; }
    public Guid? UserId { get; set; }
}

    public class ForgotPasswordUpdate
    {
        public Guid UserId { get; set; }
        public required string ForgotPwdLink { get; set; }
    }



