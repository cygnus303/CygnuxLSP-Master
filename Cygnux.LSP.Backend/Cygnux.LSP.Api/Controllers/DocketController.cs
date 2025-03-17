namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Docket;
using Cygnux.LSP.Api.Helpers;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class DocketController : ControllerBase
{
    private readonly IDocketRepository _docketRepository;

    public DocketController(IDocketRepository docketRepository)
    {
        _docketRepository = docketRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetDocketList([FromQuery] int page, [FromQuery] int pageSize)
    {
        return Ok(await _docketRepository.GetDocketList(page, pageSize));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetDocketDetails(Guid id)
    {
        return Ok(await _docketRepository.GetDocketDetails(id));
    }
    [HttpPost]
    [Route("import")]
    public async Task<IActionResult> ImporDocket(IFormFile file)
    {
        var data = ExcelReadHelper.ExtractAllRows(file);
        if (data is not null)
        {
            return Ok(await _docketRepository.ImportDocket(data));
        }
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> AddDocket(CreateDocketRequest createDocketDto)
    {
        return Ok(await _docketRepository.AddDocket(createDocketDto));
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> UpdateDocket(Guid id, CreateDocketRequest createDocketDto)
    {
        return Ok(await _docketRepository.UpdateDocket(id, createDocketDto));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> DeleteDocket(Guid id)
    {
        return Ok(await _docketRepository.DeleteDocket(id));
    }
}