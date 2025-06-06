namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Role;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationRepository _authenticationRepository;

    public AuthenticationController(IAuthenticationRepository authenticationRepository)
    {
        _authenticationRepository = authenticationRepository;
    }


}