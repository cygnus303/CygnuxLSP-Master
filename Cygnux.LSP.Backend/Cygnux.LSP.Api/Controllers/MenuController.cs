namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Menu;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class MenuController : ControllerBase
{
    private readonly IMenuRepository _menuRepository;

    public MenuController(IMenuRepository menuRepository)
    {
        _menuRepository = menuRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetMenuList()
    {
        return Ok(await _menuRepository.GetMenuList());
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetMenuDetails(Guid id)
    {
        return Ok(await _menuRepository.GetMenuDetails(id));
    }

    [HttpPost]
    public async Task<IActionResult> AddLSP(CreateMenuRequest createMenu)
    {
        return Ok(await _menuRepository.AddMenu(createMenu));
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> UpdatedLSP(Guid id, CreateMenuRequest createMenu)
    {
        return Ok(await _menuRepository.UpdateMenu(id, createMenu));
    }

    [HttpPatch]
    [Route("{id}")]
    public async Task<IActionResult> DeleteLSP(Guid id)
    {
        return Ok(await _menuRepository.DeleteMenu(id));
    }
}