namespace Cygnux.LSP.Api.Controllers;

using Cygnux.LSP.Application.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class GeneralMasterController : ControllerBase
{
    private readonly IGeneralMasterRepository _generalMasterRepsitory;

    public GeneralMasterController(IGeneralMasterRepository generalMasterRepository)
    {
        _generalMasterRepsitory = generalMasterRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetGeneralMasterList(string codeType, string? searchtext, CancellationToken cancellation)
    {
        var result = await _generalMasterRepsitory.GetGeneralMasterList(codeType, searchtext, cancellation);
        if (result == null)
            return NotFound(new { message = "General Master Data Not Found..." });

        return Ok(result);
    }

}

