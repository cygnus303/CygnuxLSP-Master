namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Role;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;
using static Cygnux.LSP.Api.Controllers.AuthenticationController;
using System.Net.Mail;
using System.Net;
using Cygnux.LSP.Api.Models;
using Cygnux.LSP.Identity;
using Newtonsoft.Json;
using static Cygnux.LSP.Api.Models.OtpVerification;
using Cygnux.LSP.Application.Models.Response;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationRepository _authenticationRepository;
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;

    public AuthenticationController(IAuthenticationRepository authenticationRepository, IEmailService emailService, AppDbContext context)
    {
        _authenticationRepository = authenticationRepository;
        _emailService = emailService;
        _context = context;
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


}