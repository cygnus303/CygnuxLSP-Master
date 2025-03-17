namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[AllowAnonymous]
public class AccountController : ControllerBase
{
    private readonly ILogger<AccountController> _logger;
    private readonly IAuthRepository _authRepository;

    public AccountController(IAuthRepository authRepository, ILogger<AccountController> logger)
    {
        _authRepository = authRepository;
        _logger = logger;
    }

    [HttpPost("Login", Name = "Login")]
    public async Task<IActionResult> Login(UserLoginRequest login)
    {
        _logger.LogInformation("{@Login} IN {@Request}", nameof(Login), login);

        if (ModelState.IsValid)
        {
            _logger.LogInformation("{@Login} OUT {@Request}", nameof(Login), login);
            return Ok(await _authRepository.LoginAsync(login));
        }
        _logger.LogInformation("{@Login} OUT BadRequest {@Request}", nameof(Login), login);

        return BadRequest();
    }
}