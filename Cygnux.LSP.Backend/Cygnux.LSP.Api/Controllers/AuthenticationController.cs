namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using Cygnux.LSP.Api.Models;
using Cygnux.LSP.Identity;
using Newtonsoft.Json;
using Cygnux.LSP.Application.Models.Response;
using Microsoft.EntityFrameworkCore;
using Cygnux.LSP.Infrastructure.Models.Response;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationRepository _authenticationRepository;
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _iconfiguration;
    private readonly IUserRepository _userRepository;

    public AuthenticationController(IAuthenticationRepository authenticationRepository, IEmailService emailService, AppDbContext context, IConfiguration iconfiguration, IUserRepository userRepository)
    {
        _authenticationRepository = authenticationRepository;
        _emailService = emailService;
        _context = context;
        _iconfiguration = iconfiguration;
        _userRepository = userRepository;
    }

   
    [HttpPost("SendOTPMail")]
    public async Task<IActionResult> SendOtpEmail([FromBody] OtpRequest request, Guid Entryby)
    {
        var user = await _context.Users.FindAsync(request.UserId);
        if (user == null)
            /*return NotFound("User not found.");*/
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "User not found.",
                Data = false
            });

        // Validate email
        if (string.IsNullOrWhiteSpace(user.Email) || !IsValidEmail(user.Email))
            /*return BadRequest("User email is invalid.");*/
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "User email is invalid.",
                Data = false
            });

        // Generate random 6-digit OTP
        var otp = new Random().Next(100000, 999999).ToString();
        var reqid = Guid.NewGuid();

        // Create verification link
        var verificationLink = $"https://uatlsp.cygnux.in/login/otp-verification/{reqid}";

        // Create OTP entry object (we’ll save only after email succeeds)
        var otpEntry = new OtpVerification
        {
            UserId = request.UserId,
            OTP = otp,
            OTPLink = verificationLink,
            OTPCreateTime = DateTime.Now,
            EntryBy = Entryby,
            RequestId = reqid,
            IsMailSend = true
        };

        // Email content
        var subject = "Verify your account";
        var body = $"Please verify your account using the link below:\n{verificationLink}\n\nYour OTP is: {otp}";

        try
        {
            // Send email
            await _emailService.SendEmailAsync(user.Email, subject, body);

            // Save OTP entry only after successful email
            await _authenticationRepository.AddOTPDetails(JsonConvert.SerializeObject(otpEntry));

            return Ok(new { Message = "OTP email sent successfully." });
        }
        catch (Exception ex)
        {
            // Optional: log exception here
            return StatusCode(500, new
            {
                Message = "Failed to send OTP email.",
                Error = ex.Message
            });
        }
    }

    /// <summary>
    /// Validates email format using built-in .NET mail address validation.
    /// </summary>
    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    /*
    public async Task<bool> IsEmailRealAsync(string email)
    {
        var client = new HttpClient();
        var response = await client.GetAsync($"http://apilayer.net/api/check?access_key=YOUR_API_KEY&email={email}&smtp=1&format=1");

        if (!response.IsSuccessStatusCode)
            return false;

        var json = await response.Content.ReadAsStringAsync();
        dynamic result = JsonConvert.DeserializeObject(json);

        return result.smtp_check == true;
    }
    */

    [HttpPost("verifyOTP")]
    public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyRequest otpreq)
    {
        // Get user by email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == otpreq.Email);
        if (user == null)
            /*return NotFound("User not found with the provided email.");*/

            return NotFound(new BaseResponseError<bool>
            {
                Status = false,
                Message = "User not found.",
                Data = false
            });

        return Ok( await _authenticationRepository.OtpVerified(JsonConvert.SerializeObject(otpreq)));
    }


    [HttpPost("resendOTP")]
    public async Task<IActionResult> ResendOtp([FromBody] OtpResendRequest otpResend)
    {
        // Step 1: Validate User and RequestId
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == otpResend.EmailId);
        if (user == null)
            return NotFound(new BaseResponseError<bool>
            {
                Status = false,
                Message = "User not found.",
                Data = false
            });

        // Step 2: Check OTP record
        var otpRecord = _authenticationRepository.CheckOTPRecord(JsonConvert.SerializeObject(otpResend));
        if (otpRecord == null)
            return NotFound(new BaseResponseError<bool>
            {
                Status = false,
                Message = "OTP record not found for given request.",
                Data = false
            });

        // Step 3: Generate new OTP
        var newOtp = new Random().Next(100000, 999999).ToString();

        // Step 4: Send OTP via email (no link)
        var subject = "Your Resent OTP";
        var body = $"Your new OTP is: {newOtp}";
        await _emailService.SendEmailAsync(otpResend.EmailId, subject, body);

        // Step 5: Call procedure to update OTP
        return Ok(await _authenticationRepository.UpdateResendOTP(newOtp, otpResend.RequestId));
    }


    [HttpPost("ResetPassword")]
    public async Task<IActionResult> ResetPassword([FromBody] PasswordResetRequest model)
    {
        if (string.IsNullOrEmpty(model.NewPassword) || model.RequestId == Guid.Empty)
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "New password is required.",
                Data = false
            });

        var userIdResponse = await _authenticationRepository.GetUserIDfromReqID(model.RequestId);
        if (userIdResponse == null || userIdResponse.Data == null)
        {
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "User ID not found.",
                Data = false
            });
        }

        Guid userId = userIdResponse.Data.UserId;

        /*string? Pwdkey = _iconfiguration.GetValue<string>("PasswordKeyForEncrypt");
        string passwordhash = PasswordHasher.Encrypt(model.NewPassword,Pwdkey);*/

        BaseResponse<GetPasswordHash> passResponse = await _userRepository.UpdatePassword(userId, model.NewPassword);

        if (passResponse == null || passResponse.Data == null)
        {
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "Password update failed.",
                Data = false
            });
        }
        return Ok(await _authenticationRepository.ResetPassword(model.RequestId, passResponse.Data.Password));
    }

    [HttpPost("ChangePassword")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest chnagmodel)
    {
        if (string.IsNullOrEmpty(chnagmodel.NewPassword) || string.IsNullOrEmpty(chnagmodel.OldPassword))
        {
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "New password is required.",
                Data = false
            });
        }

        // Step 1: Verify Old Password
        BaseResponse<CommonCreateResponse> oldpwdresp = await _userRepository.GetOldPasswordHash(chnagmodel.UserId, chnagmodel.OldPassword);

        if (oldpwdresp == null || oldpwdresp.Data == null ||
            oldpwdresp.Data.Status != 1 || oldpwdresp.Data.Message != "Old password is correct")
        {
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "Old password is incorrect.",
                Data = false
            });
        }

        // Step 2: Update Password
        BaseResponse<GetPasswordHash> newpassHash = await _userRepository.UpdatePassword(chnagmodel.UserId, chnagmodel.NewPassword);

        if (newpassHash == null || newpassHash.Data == null)
        {
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "Password update failed.",
                Data = false
            });
        }

        // Step 3: Apply the New Password in Authentication System
        return Ok(await _authenticationRepository.ChangePassword(chnagmodel.UserId, oldpwdresp.Data.Id.ToString(), newpassHash.Data.Password));

    }


    [HttpPost("ResendMail")]
    public async Task<IActionResult> ResendEmail([FromBody] ResendMailReq request, Guid Entryby)
    {
        // Step 1: Validate user
        var user = await _context.Users.FindAsync(request.UserId);
        if (user == null)
        {
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "User not found.",
                Data = false
            });
        }

        // Step 2: Validate email
        if (string.IsNullOrWhiteSpace(user.Email) || !IsValidEmail(user.Email) || user.Email != request.EmailId)
        {
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "User email is invalid.",
                Data = false
            });
        }

        // Step 3: Get resend link
        var linkResult = await _authenticationRepository.GetResendUrl(request.UserId);
        if (linkResult == null || string.IsNullOrWhiteSpace(linkResult.Data.Url))
        {
            return StatusCode(500, new
            {
                Status = false,
                Message = "Resend URL could not be generated."
            });
        }

        // Step 4: Generate OTP (securely)
        var otp = new Random().Next(100000, 999999).ToString();

        // Step 5: Prepare resend update entry
        var resendEntry = new ResendEmailUpdate
        {
            UserId = request.UserId,
            OTP = otp,
            OTPCreateTime = DateTime.Now,
            ResendMailBy = Entryby,
            IsResendMail = true
        };

        // Step 6: Prepare email
        var subject = "Re-Verify your account";
        var body = $@"
        Dear User,

        Please re-verify your account using the link below:
        {linkResult.Data.Url}

        Your new OTP is: {otp}

        Regards,
        Support Team";

        try
        {
            // Step 7: Send email
            await _emailService.SendEmailAsync(user.Email, subject, body.Trim());

            // Step 8: Save OTP and audit details
            await _authenticationRepository.UpdateResendMailDetail(JsonConvert.SerializeObject(resendEntry));

            return Ok(new
            {
                Status = true,
                Message = "OTP email sent successfully."
            });
        }
        catch (Exception ex)
        {
            // Optionally log the exception
            return StatusCode(500, new
            {
                Status = false,
                Message = "Failed to send OTP email.",
                Error = ex.Message
            });
        }
    }

}