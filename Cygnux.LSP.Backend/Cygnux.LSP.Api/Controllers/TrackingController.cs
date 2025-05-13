namespace Cygnux.LSP.Api.Controllers;
using Cygnux.LSP.Application.Contracts;
using Microsoft.AspNetCore.Mvc;


[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class TrackingController : ControllerBase
{
    private readonly ITrackingRepository _trackingRepository;

    [HttpGet]
    [Route("GetTrackigList")]
    public async Task<IActionResult> GetTrackigList(string Docketnumber)
    {
        return Ok(await _trackingRepository.GetTrackigList(Docketnumber));
    }


}

