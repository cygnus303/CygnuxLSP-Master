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
    [Route("GetDocketList")]
    public async Task<IActionResult> GetDocketList([FromQuery] int page, [FromQuery] int pageSize,Guid userId,string? docketNo , string? fromLocation,string? toLocation,int? quantity)
    {
        return Ok(await _docketRepository.GetDocketList(page, pageSize,userId,docketNo,fromLocation,toLocation,quantity));
    }

    [HttpGet]
    [Route("GetDocketDetail/{id}")]
    public async Task<IActionResult> GetDocketDetails(Guid id, Guid userId)
    {
        return Ok(await _docketRepository.GetDocketDetails(id,userId));
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
    [Route("AddDocket")]
    public async Task<IActionResult> AddDocket(CreateDocketRequest createDocketDto)
    {
        return Ok(await _docketRepository.AddDocket(createDocketDto));
    }

    [HttpPost]
    [Route("UpdateDocket/{id}")]
    public async Task<IActionResult> UpdateDocket(Guid id, CreateDocketRequest createDocketDto)
    {
        return Ok(await _docketRepository.UpdateDocket(id, createDocketDto));
    }

    [HttpPatch]
    [Route("DeleteDocket/{id}")]
    public async Task<IActionResult> DeleteDocket(Guid id)
    {
        return Ok(await _docketRepository.DeleteDocket(id));
    }

    [HttpPost]
    [Route("ImportPOD")]
    public async Task<IActionResult> ImportPODData(IFormFile file, string? User)
    {
        var PodData = ExcelReadHelper.ExtractAllRows(file);
        if (PodData is not null)
        {
            return Ok(await _docketRepository.ImportPOD(PodData,User));
        }
        return Ok();
    }
}