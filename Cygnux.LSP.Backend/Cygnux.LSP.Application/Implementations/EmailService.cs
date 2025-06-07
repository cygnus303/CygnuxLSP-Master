using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Cygnux.LSP.Application.Contracts;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var smtpClient = new SmtpClient(_config["SMTP:Host"])
        {
            Port = int.Parse(_config["SMTP:Port"]),
            Credentials = new NetworkCredential(_config["SMTP:User"], _config["SMTP:Pass"]),
            EnableSsl = true,
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_config["SMTP:Sender"]),
            Subject = subject,
            Body = body,
            IsBodyHtml = false,
        };
        mailMessage.To.Add(toEmail);

        await smtpClient.SendMailAsync(mailMessage);
    }
}
