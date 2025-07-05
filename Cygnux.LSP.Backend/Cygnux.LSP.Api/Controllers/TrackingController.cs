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
    public async Task<IActionResult> GetTrackigList(string? docketNOs,Guid userid, string? fromDate, string? toDate, int skip, int take)
    {
        return Ok(await _trackingRepository.GetTrackigList(docketNOs,userid, fromDate, toDate, skip, take));
    }

    [HttpGet]
    [Route("GetDashboardData")]
    public async Task<IActionResult> GetDashboardData(Guid userid,string fromDate, string toDate)
    {
        return Ok(await _trackingRepository.GetDashboardList(userid, fromDate, toDate));
    }
    [HttpGet]
    [Route("GetTransportModeChartData")]
    public async Task<IActionResult> GetTransportChartData(Guid userId, string fromDate, string toDate)
    {
        return Ok(await _trackingRepository.GetTransportChartData(userId, fromDate, toDate));
    }

    [HttpGet]
    public async Task<IActionResult> DownloadPOD(Guid userId, string fromDate, string toDate)
    {
        return Ok(await _trackingRepository.DownloadPOD(userId, fromDate, toDate));
    }



}