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

}