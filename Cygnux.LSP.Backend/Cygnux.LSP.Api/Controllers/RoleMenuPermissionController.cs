namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.RoleMenuPermission;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class RoleMenuPermissionController : ControllerBase
{
    private readonly IRoleMenuPermissionRepository _roleMenuPermissionRepository;

    public RoleMenuPermissionController(IRoleMenuPermissionRepository roleMenuPermissionRepository)
    {
        _roleMenuPermissionRepository = roleMenuPermissionRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetRolePermissionList()
    {
        return Ok(await _roleMenuPermissionRepository.GetRoleMenuPermissionList());
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetRolePermissionDetails(Guid id)
    {
        return Ok(await _roleMenuPermissionRepository.GetMenuPermissionByRole(id));
    }

    [HttpPost]
    [Route("{id}")]
    public async Task<IActionResult> AddRolePermission(Guid id, List<CreateRoleMenuPermissionRequest> createRoleMenuPermissionRequest)
    {
        return Ok(await _roleMenuPermissionRepository.AddRoleMenuPermission(id, createRoleMenuPermissionRequest));
    }
}