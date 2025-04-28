namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Role;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class RoleController : ControllerBase
{
    private readonly IRoleRepository _roleRepository;

    public RoleController(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetRoleList([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string? roleName)
    {
        return Ok(await _roleRepository.GetRoleList( page, pageSize, roleName));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetRoleDetails(Guid id)
    {
        return Ok(await _roleRepository.GetRoleDetails(id));
    }

    [HttpPost]
    public async Task<IActionResult> AddRole(RoleRequest roleRequest)
    {
        return Ok(await _roleRepository.AddRole(roleRequest));
    }

    [HttpPost]
    [Route("{id}")]
    public async Task<IActionResult> UpdateRole(Guid id, RoleRequest roleRequest)
    {
        return Ok(await _roleRepository.UpdateRole(id, roleRequest));
    }
}