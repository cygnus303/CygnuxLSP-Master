namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Role;
using Cygnux.LSP.Api.Hubs;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Cygnux.LSP.Api.Hubs;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class RoleController : ControllerBase
{
    private readonly IRoleRepository _roleRepository;
    private readonly IHubContext<SignalRHub> _hubContext;

    public RoleController(IRoleRepository roleRepository, IHubContext<SignalRHub> hubContext)
    {
        _roleRepository = roleRepository;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetRoleList([FromQuery] Dictionary<string, string> reqFilter)
    {
        return Ok(await _roleRepository.GetRoleList(reqFilter));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetRoleDetails(Guid id)
    {
        return Ok(await _roleRepository.GetRoleDetails(id));
    }

    [HttpGet]
    [Route("RoleIfNotExists")]
    public async Task<IActionResult> RoleIfNotExists(Guid RoleId)
    {
        return Ok(await _roleRepository.RoleIfNotExists(RoleId));
    }

    [HttpPost]
    public async Task<IActionResult> AddRole(RoleRequest roleRequest)
    {
        // return Ok(await _roleRepository.AddRole(roleRequest));

        var result = await _roleRepository.AddRole(roleRequest);

        await _hubContext.Clients.All.SendAsync("RoleListUpdated", "Role Added");

        return Ok(result);
    }

    [HttpPost]
    [Route("{id}")]
    public async Task<IActionResult> UpdateRole(Guid id, RoleRequest roleRequest)
    {
        // return Ok(await _roleRepository.UpdateRole(id, roleRequest));
        var result = await _roleRepository.UpdateRole(id, roleRequest);
        await _hubContext.Clients.All.SendAsync("RoleListUpdated", "Role Updated");
        return Ok(result);
    }


    [HttpPatch]
    [Route("DeleteRole")]
    public async Task<IActionResult> DeleteRole(Guid roleId, RoleDeleteReq deletereq)
    {
        // return Ok(await _roleRepository.DeleteRole(roleId, deletereq));

        var result = await _roleRepository.DeleteRole(roleId, deletereq);
        await _hubContext.Clients.All.SendAsync("RoleListUpdated", "Role Deleted");
        return Ok(result);
    }
}