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
        {
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "User not found.",
                Data = false
            });
        }

        if (string.IsNullOrWhiteSpace(user.Email) || !IsValidEmail(user.Email))
        {
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "User email is invalid.",
                Data = false
            });
        }

        // Generate random 6-digit OTP
        var otp = new Random().Next(100000, 999999).ToString();
        var reqid = Guid.NewGuid();

        // Create verification link
        var verificationLink = $"https://uatlsp.cygnux.in/login/otp-verification/{reqid}";

        // Prepare OTP entry
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

        // Email subject
        var subject = "Verify your account - Logistic Service Provider";

        // Generate HTML body
        var htmlBody = $@"
            <!DOCTYPE html>
            <html lang='en' style='margin:0; padding:0;'>
            <head>
              <meta charset='UTF-8' />
              <meta name='viewport' content='width=device-width, initial-scale=1' />
              <title>OTP Verification</title>
              <link href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' rel='stylesheet' />
              <style>
                body {{
                  font-family: 'Roboto', Arial, sans-serif;
                  background-color: #f6f9fc;
                  margin: 0;
                  padding: 0;
                }}
                .container {{
                  max-width: 600px;
                  margin: 40px auto;
                  background-color: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                  overflow: hidden;
                  color: #333333;
                }}
                .header-image {{
                  width: 100%;
                  height: auto;
                  display: block;
                }}
                h1 {{
                  color: #e67e22;
                  font-size: 30px;
                  margin: 20px 0 10px 0;
                  text-align: center;
                  font-weight: 700;
                }}
                h3 {{
                  color: #154360;
                  font-size: 20px;
                  margin: 10px 0 20px 0;
                  font-weight: 500;
                  padding: 0 24px;
                  text-align: left;
                }}
                p {{
                  font-size: 16px;
                  line-height: 1.7;
                  color: #444444;
                  padding: 0 24px;
                  text-align: left;
                }}
                .otp-code {{
                  display: inline-block;
                  background-color: #e0e7ff;
                  color: #1e40af;
                  font-weight: 700;
                  font-size: 30px;
                  letter-spacing: 10px;
                  padding: 12px 24px;
                  border-radius: 8px;
                  margin: 20px auto;
                  user-select: all;
                }}
                .otp-container {{
                  text-align: center;
                }}
                .footer {{
                  margin: 30px 0 15px 0;
                  font-size: 13px;
                  color: #888888;
                  text-align: center;
                  padding: 0 20px;
                }}
                a {{
                  color: #2e86c1;
                  text-decoration: none;
                  word-break: break-all;
                  font-weight: 500;
                }}
              </style>
            </head>
            <body>
              <div class='container'>
                <img src='https://uatlsp.cygnux.in/Uploads/LSP_LOGO.png' alt='OTP Verification' class='header-image'>
                <h1>Welcome to Logistic Service Provider</h1>
                <h3>Hello {user.FirstName + " " + user.LastName ?? "User"},</h3>
                <p>Please verify your account using the link below:</p>
                <p><a href='{verificationLink}' target='_blank'>{verificationLink}</a></p>
                <p>Your OTP code is:</p>
                <div class='otp-container'>
                  <div class='otp-code' aria-label='One-Time Password code'>{otp}</div>
                </div>
                <p>Please enter this code to complete your verification. This code is valid for a limited time only.</p>
                <p>If you did not request this, please ignore this email.</p>
                <div class='footer'>
                  &copy; {DateTime.Now.Year} Logistic Service Provider. All rights reserved.
                </div>
              </div>
            </body>
            </html>";

        try
        {
            // Send email with HTML content
            await _emailService.SendEmailAsync(user.Email, subject, htmlBody, isHtml: true);

            // Save OTP entry after successful email
            await _authenticationRepository.AddOTPDetails(JsonConvert.SerializeObject(otpEntry));

            return Ok(new { Message = "OTP email sent successfully." });
            //return Ok(new BaseResponseError<string>
            //{
            //    Status = true,
            //    Message = "OTP email sent successfully.",
            //    Data = verificationLink
            //});
        }
        catch (Exception ex)
        {
            // Log the exception as needed
            return StatusCode(500, new BaseResponseError<string>
            {
                Status = false,
                Message = "Failed to send OTP email.",
                Data = ex.Message
            });
        }
    }


    //public async Task<IActionResult> SendOtpEmail([FromBody] OtpRequest request, Guid Entryby)
    //{
    //    var user = await _context.Users.FindAsync(request.UserId);
    //    if (user == null)
    //        /*return NotFound("User not found.");*/
    //        return BadRequest(new BaseResponseError<bool>
    //        {
    //            Status = false,
    //            Message = "User not found.",
    //            Data = false
    //        });

    //    // Validate email
    //    if (string.IsNullOrWhiteSpace(user.Email) || !IsValidEmail(user.Email))
    //        /*return BadRequest("User email is invalid.");*/
    //        return BadRequest(new BaseResponseError<bool>
    //        {
    //            Status = false,
    //            Message = "User email is invalid.",
    //            Data = false
    //        });

    //    // Generate random 6-digit OTP
    //    var otp = new Random().Next(100000, 999999).ToString();
    //    var reqid = Guid.NewGuid();

    //    // Create verification link
    //    var verificationLink = $"https://uatlsp.cygnux.in/login/otp-verification/{reqid}";

    //    // Create OTP entry object (we’ll save only after email succeeds)
    //    var otpEntry = new OtpVerification
    //    {
    //        UserId = request.UserId,
    //        OTP = otp,
    //        OTPLink = verificationLink,
    //        OTPCreateTime = DateTime.Now,
    //        EntryBy = Entryby,
    //        RequestId = reqid,
    //        IsMailSend = true
    //    };

    //    // Email content
    //    var subject = "Verify your account";
    //    var body = $"Please verify your account using the link below:\n{verificationLink}\n\nYour OTP is: {otp}";

    //    try
    //    {
    //        // Send email
    //        await _emailService.SendEmailAsync(user.Email, subject, body);

    //        // Save OTP entry only after successful email
    //        await _authenticationRepository.AddOTPDetails(JsonConvert.SerializeObject(otpEntry));

    //        return Ok(new { Message = "OTP email sent successfully." });
    //    }
    //    catch (Exception ex)
    //    {
    //        // Optional: log exception here
    //        return StatusCode(500, new
    //        {
    //            Message = "Failed to send OTP email.",
    //            Error = ex.Message
    //        });
    //    }
    //}

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
        // Get user by RequestId
        var userResponse = await _authenticationRepository.GetUserIDfromReqID(otpreq.RequestId);
        if (userResponse == null || userResponse.Data == null)
        {
            return NotFound(new BaseResponseError<bool>
            {
                Status = false,
                Message = "User not found.",
                Data = false
            });
        }

        var userId = userResponse.Data.UserId; // Extract Guid here

        var email = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        var Otprequest = new OtpVerifyRequest
        {
             RequestId = otpreq.RequestId,
             Email = email.Email.ToString() ?? otpreq.Email,
             OTP = otpreq.OTP
        };

        return Ok(await _authenticationRepository.OtpVerified(JsonConvert.SerializeObject(Otprequest)));
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
        await _emailService.SendEmailAsync(otpResend.EmailId, subject, body, isHtml:true);

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
            await _emailService.SendEmailAsync(user.Email, subject, body.Trim(),isHtml:true);

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

   
    [HttpPost("ForgotPassword")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "Email is required.",
                Data = false
            });
        }

        try
        {
            // Step 1: Get User by Email
            BaseResponse<GetUserId> userResponse = await _userRepository.GetUserFromEmailId(request.Email);

            if (userResponse?.Data == null || userResponse.Data.UserId == Guid.Empty)
            {
                return NotFound(new BaseResponseError<bool>
                {
                    Status = false,
                    Message = "No user found with the provided email.",
                    Data = false
                });
            }

            Guid userId = userResponse.Data.UserId;

            // Step 2: Get Request ID (used in link)
            BaseResponse<GetID> idResponse = await _authenticationRepository.GetReqIdfromUserId(userId);

            if (idResponse?.Data == null)
            {
                return StatusCode(500, new BaseResponseError<bool>
                {
                    Status = false,
                    Message = "Failed to generate password reset link.",
                    Data = false
                });
            }

            string forgotPassUrl = $"https://uatlsp.cygnux.in/login/changePassword/{idResponse.Data.ReqID}";

            var passEntry = new ForgotPasswordUpdate
            {
                UserId = userId,
                ForgotPwdLink = forgotPassUrl
            };

            // Step 3: Send Email
            var subject = "Forgot Password Reset";
            var body = $"Please reset your password using the link below:\n{forgotPassUrl}";

            await _emailService.SendEmailAsync(request.Email, subject, body, isHtml: true);

            // Step 4: Save reset link info in DB
            await _authenticationRepository.ForgotPWDdataUpdate(JsonConvert.SerializeObject(passEntry));

            // Step 5: Return success response
            return Ok(new BaseResponseError<string>
            {
                Status = true,
                Message = "Forgot password link has been sent to your email.",
                Data = forgotPassUrl
            });
        }
        catch (Exception ex)
        {
            // Optionally log exception
            return StatusCode(500, new BaseResponseError<string>
            {
                Status = false,
                Message = "Failed to process forgot password request.",
                Data = ex.Message
            });
        }
    }



}