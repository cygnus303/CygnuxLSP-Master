namespace Cygnux.LSP.Infrastructure.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Models.Response;
using Models.Response.LspMapping;

public interface IAuthenticationservice
{
    Task<CommonCreateResponse> AddOTPDetails(string otpentry);
    Task<CommonCreateResponse> OtpVerified(string otpreq);
    Task<CommonCreateResponse> CheckOTPRecord(string otpResend);
    Task<CommonCreateResponse> UpdateResendOTP(string otp, Guid RequestId);
    Task<CommonCreateResponse> ResetPassword(Guid? ReqId, string Pwd);
    Task<GetUserId> GetUserIDfromReqID(Guid? ReqId);
    Task<CommonCreateResponse> ChangePassword(Guid userid, string oldPwd, string NewPwd);
    Task<GetLink> GetResendUrl(Guid UserId);
    Task<CommonCreateResponse> UpdateResendMailDetail(string resendEntry);
}       