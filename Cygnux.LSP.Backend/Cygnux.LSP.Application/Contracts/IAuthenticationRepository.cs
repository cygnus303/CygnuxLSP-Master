namespace Cygnux.LSP.Application.Contracts;

using Cygnux.LSP.Infrastructure.Models.Response;
using Models.Response;
public interface IAuthenticationRepository
{
    Task<BaseResponse<CommonCreateResponse>> AddOTPDetails(string otpentry);
}