namespace Cygnux.LSP.Application.Implementations;
using Contracts;
using Cygnux.LSP.Application.Models.Request.Docket;
using Cygnux.LSP.Application.Models.Response;
using Cygnux.LSP.Infrastructure.Models.Response;
using Infrastructure.Contracts;


internal class AuthenticationRepository : IAuthenticationRepository
{
    private readonly IAuthenticationservice _authenticationService;

    public AuthenticationRepository(IAuthenticationservice authenticationService)
    {
        _authenticationService = authenticationService;
    }

    public async Task<BaseResponse<CommonCreateResponse>> AddOTPDetails(string otpentry)
    {
        var response = await _authenticationService.AddOTPDetails(otpentry);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
    public async Task<BaseResponse<CommonCreateResponse>> OtpVerified(string otpreq)
    {
        var response = await _authenticationService.OtpVerified(otpreq);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<CommonCreateResponse>> CheckOTPRecord(string otpResend)
    {
        var response = await _authenticationService.CheckOTPRecord(otpResend);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
    public async Task<BaseResponse<CommonCreateResponse>> UpdateResendOTP(string otp, Guid RequestId)
    {
        var response = await _authenticationService.UpdateResendOTP(otp,RequestId);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
    public async Task<BaseResponse<CommonCreateResponse>> ResetPassword(Guid? ReqId, string Pwd)
    {
        var response = await _authenticationService.ResetPassword(ReqId, Pwd);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }

    public async Task<BaseResponse<GetUserId>> GetUserIDfromReqID(Guid? ReqId)
    {
        var response = await _authenticationService.GetUserIDfromReqID(ReqId);

        return new BaseResponse<GetUserId>(response);
                   
    }
    public async Task<BaseResponse<CommonCreateResponse>> ChangePassword(Guid userid, string oldPwd, string NewPwd)
    {
        var response = await _authenticationService.ChangePassword(userid, oldPwd, NewPwd);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
    public async Task<BaseResponse<GetLink>> GetResendUrl(Guid UserId)
    {
        var response = await _authenticationService.GetResendUrl(UserId);

        return new BaseResponse<GetLink>(response);

    }
    public async Task<BaseResponse<CommonCreateResponse>> UpdateResendMailDetail(string resendEntry)
    {
        var response = await _authenticationService.UpdateResendMailDetail(resendEntry);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
    public async Task<BaseResponse<GetID>> GetReqIdfromUserId(Guid userid)
    {
        var response = await _authenticationService.GetReqIdfromUserId(userid);

        return new BaseResponse<GetID>(response);

    }

    public async Task<BaseResponse<CommonCreateResponse>> ForgotPWDdataUpdate(string pwdEntry)
    {
        var response = await _authenticationService.ForgotPWDdataUpdate(pwdEntry);

        return response.Status > 0 ? new BaseResponse<CommonCreateResponse>(response)
                   : new BaseResponse<CommonCreateResponse>(new ErrorResponse { Message = response.Message });
    }
}