namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class UserRoleController : ControllerBase
{
    private readonly IUserRoleRepository _userRoleRepository;
    private readonly ICustomerLspRepository _customerLspRepository;

    public UserRoleController(IUserRoleRepository userRoleRepository, ICustomerLspRepository customerLspRepository)
    {
        _userRoleRepository = userRoleRepository;
        _customerLspRepository = customerLspRepository;
    }

    [HttpPost]
    public async Task<IActionResult> AddUserRole(Guid userId, string roleName)
    {
        return Ok(await _userRoleRepository.AddUserRole(userId, roleName));
    }

    [HttpPost]
    [Route("{id}")]
    public async Task<IActionResult> UpdateUserRole(Guid id, string roles)
    {
        return Ok(await _userRoleRepository.UpdateUserRoles(id, roles));
    }

    [HttpPost]
    [Route("UserRoleWithLogo")]
    public async Task<IActionResult> UserRoleWithLogo(Guid UserId)
    {
        return Ok( await _customerLspRepository.GetUserRolesById(UserId));
    }
}