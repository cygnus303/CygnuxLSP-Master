namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Docket;
using Cygnux.LSP.Api.Helpers;
using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.AspNetCore.Mvc;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;


[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class DocketController : ControllerBase
{
    private readonly IDocketRepository _docketRepository;
    private readonly IWebHostEnvironment _env;

    //public DocketController(IDocketRepository docketRepository)
    //{
    //    _docketRepository = docketRepository;
    //}
    public DocketController(IWebHostEnvironment env, IDocketRepository docketRepository)
    {
        _env = env;
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

    [HttpGet]
    [Route("GetDropdowndata")]
    public async Task<IActionResult> GetTATdata(Guid CustomerId,string? origin, string? destination)
    {
        return Ok(await _docketRepository.GetTATdata(CustomerId,origin,destination));
    }


    //[HttpPost]
    //[Route("ImportPOD")]
    //public async Task<IActionResult> ImportPODData(IFormFile file, string? User)
    //{
    //    var PodData = ExcelReadHelper.ExtractAllRows(file);
    //    if (PodData is not null)
    //    {
    //        return Ok(await _docketRepository.ImportPOD(PodData, User));
    //    }
    //    return Ok();
    //}

        /*
        [HttpPost("ImportPOD")]
        public async Task<IActionResult> UploadExcelWithImages(IFormFile excelFile, string? User)
        {
            if (excelFile == null || excelFile.Length == 0)
                return BadRequest("No Excel file uploaded.");

            var podDataList = new List<PODDataList>();

            try
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UploadedImages");

                // Make sure the folder exists
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder); // Create folder if not exists
                }

                using (var stream = new MemoryStream())
                {
                    await excelFile.CopyToAsync(stream);
                    stream.Position = 0;

                    XSSFWorkbook workbook = new XSSFWorkbook(stream);
                    ISheet sheet = workbook.GetSheetAt(0);

                    int rowCount = sheet.LastRowNum;
                    for (int row = 1; row <= rowCount; row++)
                    {
                        IRow currentRow = sheet.GetRow(row);
                        if (currentRow == null) continue;

                        string docketNo = currentRow.GetCell(0)?.ToString()?.Trim();
                        string uploadDateText = currentRow.GetCell(1)?.ToString()?.Trim();
                        string imageLink = currentRow.GetCell(2)?.ToString()?.Trim();

                        if (string.IsNullOrEmpty(docketNo))
                            continue;

                        var podEntry = new PODDataList
                        {
                            DocketNo = docketNo,
                            UploadDate = (DateTime)(DateTime.TryParse(uploadDateText, out var parsedDate) ? parsedDate : (DateTime?)null),
                            ImageLink = null
                        };

                        if (!string.IsNullOrEmpty(imageLink) && System.IO.File.Exists(imageLink))
                        {
                            // Create a unique filename
                            //var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(imageLink)}";
                            var uniqueFileName = $"{podEntry.DocketNo}{Path.GetExtension(imageLink)}";
                            var savePath = Path.Combine(uploadsFolder, uniqueFileName);

                            // Copy the file to server folder
                            System.IO.File.Copy(imageLink, savePath, true);

                            // Save only the relative path in DB
                            podEntry.ImageLink = Path.Combine("UploadedImages", uniqueFileName).Replace("\\", "/");
                        }
                        else
                        {
                            podEntry.ImageLink = null;
                        }

                        podDataList.Add(podEntry);
                    }
                }

                if (podDataList.Any())
                {
                    var result = await _docketRepository.ImportPOD(podDataList, User);
                    return Ok(result);
                }

                return Ok(new { message = "No valid data found in Excel file." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }*/




    }