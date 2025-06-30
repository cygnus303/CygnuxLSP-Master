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

    public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml)
    {
        try
        {
            using var smtpClient = new SmtpClient(_config["SMTP:Host"])
            {
                Port = int.Parse(_config["SMTP:Port"]),
                Credentials = new NetworkCredential(_config["SMTP:User"], _config["SMTP:Pass"]),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false
            };

            using var mailMessage = new MailMessage
            {
                From = new MailAddress(_config["SMTP:Sender"]),
                Subject = subject,
                Body = body,
                IsBodyHtml = isHtml // enable HTML rendering when true
            };

            mailMessage.To.Add(toEmail);

            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (SmtpException smtpEx)
        {
            throw new Exception($"SMTP failed: {smtpEx.Message} | Inner: {smtpEx.InnerException?.Message}", smtpEx);
        }
        catch (Exception ex)
        {
            throw new Exception($"Unexpected failure: {ex.Message}", ex);
        }
    }


    //public async Task SendEmailAsync(string toEmail, string subject, string body)
    //{
    //    try
    //    {
    //        var smtpClient = new SmtpClient(_config["SMTP:Host"])
    //        {
    //            Port = int.Parse(_config["SMTP:Port"]),
    //            Credentials = new NetworkCredential(_config["SMTP:User"], _config["SMTP:Pass"]),
    //            EnableSsl = true,
    //            DeliveryMethod = SmtpDeliveryMethod.Network,
    //            UseDefaultCredentials = false
    //        };

    //        var mailMessage = new MailMessage
    //        {
    //            From = new MailAddress(_config["SMTP:Sender"]),
    //            Subject = subject,
    //            Body = body,
    //            IsBodyHtml = false
    //        };

    //        mailMessage.To.Add(toEmail);

    //        await smtpClient.SendMailAsync(mailMessage);
    //    }
    //    catch (SmtpException smtpEx)
    //    {
    //        throw new Exception($"SMTP failed: {smtpEx.Message} | Inner: {smtpEx.InnerException?.Message}", smtpEx);
    //    }
    //    catch (Exception ex)
    //    {
    //        throw new Exception($"Unexpected failure: {ex.Message}", ex);
    //    }
    //}

}
