namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Lsp;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class LspController : ControllerBase
{
    private readonly ILspRepository _lspRepository;

    public LspController(ILspRepository lspRepository)
    {
        _lspRepository = lspRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetLspList([FromQuery] int page, [FromQuery] int pageSize)
    {
        return Ok(await _lspRepository.GetLspList(page, pageSize));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetLspDetails(Guid id)
    {
        return Ok(await _lspRepository.GetLspDetails(id));
    }

    [HttpPost]
    public async Task<IActionResult> AddLSP([FromForm] CreateLspRequest createLsp, IFormFile file)
    {
        if (file != null && file.Length > 0)
        {
            // Process file
            var filePath = Path.Combine("Uploads", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            createLsp.Logo = filePath;
        }
        return Ok(await _lspRepository.AddLsp(createLsp));
    }

    [HttpPost]
    [Route("{id}")]
    public async Task<IActionResult> UpdatedLSP(Guid id, [FromForm] CreateLspRequest createLsp, IFormFile? file)
    {
        if (file != null && file.Length > 0)
        {
            // Process file
            var filePath = Path.Combine("Uploads", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            createLsp.Logo = filePath;
        }
        else if (!string.IsNullOrEmpty(createLsp.Logo))
        {
            createLsp.Logo = createLsp.Logo.Replace($"{Request.Scheme}://{Request.Host}/", "");
        }
        return Ok(await _lspRepository.UpdateLsp(id, createLsp));
    }

    [HttpPatch]
    [Route("{id}")]
    public async Task<IActionResult> DeleteLSP(Guid id)
    {
        return Ok(await _lspRepository.DeleteLsp(id));
    }
}