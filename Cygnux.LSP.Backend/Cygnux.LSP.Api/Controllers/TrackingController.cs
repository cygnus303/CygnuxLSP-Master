namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Docket;
using Azure;
using ClosedXML.Excel;
using Cygnux.LSP.Api.Helpers;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using DocumentFormat.OpenXml.Presentation;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;


[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class TrackingController : ControllerBase
{
    private readonly ITrackingRepository _trackingRepository;

    public TrackingController(ITrackingRepository trackingRepository)
    {
        _trackingRepository = trackingRepository;
    }

    [HttpGet]
    [Route("GetTrackigList")]
    public async Task<IActionResult> GetTrackigList(string docketNOs)
    {
        return Ok(await _trackingRepository.GetTrackigList(docketNOs));
    }

}