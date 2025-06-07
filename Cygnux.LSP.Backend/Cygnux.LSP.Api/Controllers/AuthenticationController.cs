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

    [HttpPost("send-otp-email")]
    public async Task<IActionResult> SendOtpEmail([FromBody] OtpRequest request, Guid Entryby)
    {
        var user = await _context.Users.FindAsync(request.UserId);
        if (user == null)
            return NotFound("User not found.");

        // Validate email
        if (string.IsNullOrWhiteSpace(user.Email) || !IsValidEmail(user.Email))
            return BadRequest("User email is invalid.");

        // Generate random 6-digit OTP
        var otp = new Random().Next(100000, 999999).ToString();

        // Create verification link
        var verificationLink = $"https://uatlsp.cygnux.in/login/otp-verification/{request.UserId}";

        // Create OTP entry
        var otpEntry = new OtpVerification
        {
            UserId = request.UserId,
            OTP = otp,
            OTPLink = verificationLink,
            OTPCreateTime = DateTime.Now,
            EntryBy = Entryby
        };

        // Save OTP entry
        await _authenticationRepository.AddOTPDetails(JsonConvert.SerializeObject(otpEntry));

        // Email content
        var subject = "Verify your account";
        var body = $"Please verify your account using the link below:\n{verificationLink}\n\nYour OTP is: {otp}";

        // Send email
        await _emailService.SendEmailAsync(user.Email, subject, body);

        return Ok(new { Message = "OTP email sent successfully." });
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

    //[HttpPost("sendOTPemail")]
    //public async Task<IActionResult> SendOtpEmail([FromBody] OtpRequest request,Guid Entryby)
    //{
    //    var user = await _context.Users.FindAsync(request.UserId);
    //    if (user == null)
    //        return NotFound("User not found.");

    //    // Generate random 6-digit OTP
    //    var otp = new Random().Next(100000, 999999).ToString();

    //    // Create verification link
    //    var verificationLink = $"https://uatlsp.cygnux.in/login/otp-verification/{request.UserId}";

    //    var otpEntry = new OtpVerification
    //    {
    //        UserId = request.UserId,
    //        OTP = otp,
    //        OTPLink = verificationLink,
    //        OTPCreateTime = DateTime.Now,
    //        EntryBy = Entryby
    //    };

    //    //_context.OtpVerifications.Add(otpEntry);
    //    //await _context.SaveChangesAsync();

    //    await _authenticationRepository.AddOTPDetails(JsonConvert.SerializeObject(otpEntry));

    //    // Email content
    //    var subject = "Verify your account";
    //    var body = $"Please verify your account using the link below:\n{verificationLink}\nYour OTP is: {otp}";

    //    // Send email (simplified)
    //    await _emailService.SendEmailAsync(user.Email, subject, body);

    //    return Ok(new { Message = "OTP email sent successfully." });
    //}

}