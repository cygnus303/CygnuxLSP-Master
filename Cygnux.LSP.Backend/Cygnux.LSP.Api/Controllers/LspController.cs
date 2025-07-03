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
    [Route("GetLSPList")]
    public async Task<IActionResult> GetLspList(Guid userId, [FromQuery] Dictionary<string, string> jsonreq)
    {
        return Ok(await _lspRepository.GetLspList(userId, jsonreq));
    }

    [HttpGet]
    [Route("GetDetails")]
    public async Task<IActionResult> GetLspDetails(Guid lspid)
    {
        return Ok(await _lspRepository.GetLspDetails(lspid));
    }

    [HttpPost]
    [Route("AddLsp")]
    //public async Task<IActionResult> AddLSP([FromForm] CreateLspRequest createLsp, IFormFile file)
    //{
    //    if (file != null && file.Length > 0)
    //    {
    //        // Process fileGetLSPList
    //        var filePath = Path.Combine("Uploads", file.FileName);
    //        using (var stream = new FileStream(filePath, FileMode.Create))
    //        {
    //            await file.CopyToAsync(stream);
    //        }
    //        createLsp.Logo = filePath;
    //    }
    //    return Ok(await _lspRepository.AddLsp(createLsp));
    //}

    public async Task<IActionResult> AddLSP([FromForm] CreateLspRequest createLsp, IFormFile file)
    {
        if (file != null && file.Length > 0)
        {
            var folderPath = Path.Combine("Uploads", "LspLogo");

            // Ensure the directory exists
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var filePath = Path.Combine(folderPath, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            createLsp.Logo = filePath;
        }

        return Ok(await _lspRepository.AddLsp(createLsp));
    }


    //[HttpPost]
    //[Route("UpdateLsp/{id}")]
    //public async Task<IActionResult> UpdatedLSP(Guid id, [FromForm] CreateLspRequest createLsp, IFormFile? file)
    //{
    //    if (file != null && file.Length > 0)
    //    {
    //        // Process file
    //        var filePath = Path.Combine("Uploads", file.FileName);
    //        using (var stream = new FileStream(filePath, FileMode.Create))
    //        {
    //            await file.CopyToAsync(stream);
    //        }
    //        createLsp.Logo = filePath;
    //    }
    //    else if (!string.IsNullOrEmpty(createLsp.Logo))
    //    {
    //        createLsp.Logo = createLsp.Logo.Replace($"{Request.Scheme}://{Request.Host}/", "");
    //    }
    //    return Ok(await _lspRepository.UpdateLsp(id, createLsp));
    //}

    [HttpPost]
    [Route("UpdateLsp/{id}")]
    public async Task<IActionResult> UpdatedLSP(Guid id, [FromForm] CreateLspRequest createLsp, IFormFile? file)
    {
        if (file != null && file.Length > 0)
        {
            var folderPath = Path.Combine("Uploads", "LspLogo");

            // Ensure the directory exists
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var filePath = Path.Combine(folderPath, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            createLsp.Logo = filePath;
        }
        else if (!string.IsNullOrEmpty(createLsp.Logo))
        {
            // Remove base URL if logo already exists and is passed from client
            createLsp.Logo = createLsp.Logo.Replace($"{Request.Scheme}://{Request.Host}/", "");
        }

        return Ok(await _lspRepository.UpdateLsp(id, createLsp));
    }


    [HttpPatch]
    [Route("DeleteLsp")]
    public async Task<IActionResult> DeleteLSP(Guid lspid)
    {
        return Ok(await _lspRepository.DeleteLsp(lspid));
    }

    [HttpGet]
    [Route("GetDeleteLSPData")]
    public async Task<IActionResult> DeleteLSPDetails(Guid lspid)
    {
        return Ok(await _lspRepository.DeleteLSPDetails(lspid));
    }

    [HttpGet]
    [Route("LspCount")]
    public async Task<IActionResult> LspCount()
    {
        return Ok(await _lspRepository.LspCount());
    }

    [HttpGet]
    [Route("Lsps")]
    public async Task<IActionResult> Lsps(Guid userId)
    {
        return Ok(await _lspRepository.Lsps(userId));
    }
}