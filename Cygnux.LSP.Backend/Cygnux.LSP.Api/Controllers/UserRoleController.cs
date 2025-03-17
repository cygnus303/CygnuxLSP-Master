namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class UserRoleController : ControllerBase
{
    private readonly IUserRoleRepository _userRoleRepository;

    public UserRoleController(IUserRoleRepository userRoleRepository)
    {
        _userRoleRepository = userRoleRepository;
    }

    [HttpPost]
    public async Task<IActionResult> AddUserRole(Guid userId, string roleName)
    {
        return Ok(await _userRoleRepository.AddUserRole(userId, roleName));
    }

    [HttpPost]
    [Route("{id}")]
    public async Task<IActionResult> UpdateUserRole(Guid id, List<string> roles)
    {
        return Ok(await _userRoleRepository.UpdateUserRoles(id, roles));
    }
}