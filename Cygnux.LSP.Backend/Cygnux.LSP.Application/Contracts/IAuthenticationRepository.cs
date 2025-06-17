namespace Cygnux.LSP.Application.Contracts;

using Azure.Core;
using Cygnux.LSP.Infrastructure.Models.Response;
using Models.Response;
public interface IAuthenticationRepository
{
    Task<BaseResponse<CommonCreateResponse>> AddOTPDetails(string otpentry);
    Task<BaseResponse<CommonCreateResponse>> OtpVerified(string otpreq);
    Task<BaseResponse<CommonCreateResponse>> CheckOTPRecord(string otpResend);
    Task<BaseResponse<CommonCreateResponse>> UpdateResendOTP(string otp, Guid RequestId);
    Task<BaseResponse<CommonCreateResponse>> ResetPassword(Guid? ReqId, string Pwd);
    Task<BaseResponse<GetUserId>> GetUserIDfromReqID(Guid? ReqId);
    Task<BaseResponse<CommonCreateResponse>> ChangePassword(Guid userid, string oldPwd,string NewPwd);
    Task<BaseResponse<GetLink>> GetResendUrl(Guid UserId);
    Task<BaseResponse<CommonCreateResponse>> UpdateResendMailDetail(string resendEntry);

}