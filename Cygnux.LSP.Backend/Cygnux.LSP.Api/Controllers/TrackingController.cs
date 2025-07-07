namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Docket;
using Azure;
using ClosedXML.Excel;
using Cygnux.LSP.Api.Helpers;
using Cygnux.LSP.Infrastructure.Contracts;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using DocumentFormat.OpenXml.Presentation;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System.IO.Compression;

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

    [HttpGet("GetDownloadPODData")]
    public async Task<IActionResult> DownloadPOD(Guid userId, string StartDate, string EndDate)
    {
        var result = await _trackingRepository.DownloadPOD(userId, StartDate, EndDate);

        if (result?.Data == null || !result.Data.Any())
            return NotFound("No PODs found.");

        var podList = result.Data;

        using var memoryStream = new MemoryStream();
        using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
        using (var httpClient = new HttpClient())
        {
            foreach (var pod in podList)
            {
                try
                {
                    var response = await httpClient.GetAsync(pod.PODLink);
                    if (!response.IsSuccessStatusCode) continue;

                    var fileBytes = await response.Content.ReadAsByteArrayAsync();
                    var fileName = Path.GetFileName(pod.PODLink);

                    var zipEntry = archive.CreateEntry(fileName, CompressionLevel.Fastest);
                    using var zipStream = zipEntry.Open();
                    await zipStream.WriteAsync(fileBytes, 0, fileBytes.Length);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error downloading {pod.PODLink}: {ex.Message}");
                }
            }
        }

        memoryStream.Position = 0;
        return File(memoryStream.ToArray(), "application/zip", "POD_Images.zip");
    }

}