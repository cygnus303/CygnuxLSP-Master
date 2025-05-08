namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Docket;
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
public class DocketController : ControllerBase
{
    private readonly IDocketRepository _docketRepository;
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _iconfiguration;
    private readonly ICustomerLspRepository _customerLspRepository;

    //public DocketController(IDocketRepository docketRepository)
    //{
    //    _docketRepository = docketRepository;
    //}
    public DocketController(IWebHostEnvironment env, IDocketRepository docketRepository,IConfiguration iconfiguration, ICustomerLspRepository customerLspRepository)
    {
        _env = env;
        _docketRepository = docketRepository;
        _iconfiguration = iconfiguration;
        _customerLspRepository = customerLspRepository;
    }

    [HttpGet]
    [Route("GetDocketList")]
    public async Task<IActionResult> GetDocketList([FromQuery] int page, [FromQuery] int pageSize,Guid userId,string? docketNo , string? fromLocation,string? toLocation,int? quantity,string? transporter,string? transportmode)
    {
        return Ok(await _docketRepository.GetDocketList(page, pageSize,userId,docketNo,fromLocation,toLocation,quantity,transporter,transportmode));
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

        
    [HttpGet]
    [Route("TrackingList")]
    public async Task<IActionResult> GetTrackingList(string codetype)
    {
        var result = await _docketRepository.GetTrackingList(codetype);
        return Ok(result);
    }

    [HttpGet]
    [Route("FetchDocData")]
    public async Task<IActionResult> GetDocketData(string docketno)
    {
        var result = await _docketRepository.GetDocketData(docketno);
        return Ok(result);
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
    public async Task<IActionResult> GetTATdataFrom(Guid CustomerId, string? origin, string? destination)
    {
        return Ok(await _docketRepository.GetTATdata(CustomerId, origin, destination));
    }

    [HttpGet]
    [Route("GetDropdowndataTo")]
    public async Task<IActionResult> GetTATdataTo(Guid CustomerId, string? origin, string? destination)
    {
        return Ok(await _docketRepository.GetTATdata(CustomerId, origin, destination));
    }

    [HttpPost]
    [Route("ValidateDocketList")]
    public async Task<IActionResult> GetValidateDocketImportData(IFormFile file, Guid customerid)
    {
        var data = ExcelReadHelper.ExtractAllRows(file);
        if (data is not null)
        {
            return Ok(await _docketRepository.GetValidateDocketImportData(data,customerid));
        }
        return Ok();
    }

    [HttpPost]
    [Route("InsertExcelUplaodDocketData")]
    public async Task<IActionResult> InsertDocketData(List<DocketEntryExcelUpload> docketlist,Guid entryBy)
    {
        return Ok(await _docketRepository.InsertDocketData(docketlist,entryBy));
    }

    [HttpPost("ImportPOD")]
    public async Task<IActionResult> UploadExcelWithImages(IFormFile excelFile, List<IFormFile> imageFiles, Guid User)
    {
        if (excelFile == null || excelFile.Length == 0)
            return BadRequest("No Excel file uploaded.");

        if (imageFiles == null || !imageFiles.Any())
            return BadRequest("No image files uploaded.");

        var podDataList = new List<PODDataList>();

        try
        {
            //var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UploadedImages");
            var uploadsFolder = _iconfiguration.GetValue<string>("ImagePath");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
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
                    string imageFileName = currentRow.GetCell(2)?.ToString()?.Trim();

                    if (string.IsNullOrEmpty(docketNo))
                        continue;

                    var podEntry = new PODDataList
                    {
                        DocketNo = docketNo,
                        UploadDate = (DateTime)(DateTime.TryParse(uploadDateText, out var parsedDate) ? parsedDate : (DateTime?)null),
                        ImageLink = null
                    };

                    if (!string.IsNullOrEmpty(imageFileName))
                    {
                        //var matchedImage = imageFiles.FirstOrDefault(f => f.FileName.Equals(imageFileName, StringComparison.OrdinalIgnoreCase));
                        var matchedImage = imageFiles.FirstOrDefault(f =>
                            Path.GetFileName(f.FileName).Equals(Path.GetFileName(imageFileName), StringComparison.OrdinalIgnoreCase));

                        if (matchedImage != null)
                        {
                            var uniqueFileName = $"{docketNo}{Path.GetExtension(matchedImage.FileName)}";
                            var savePath = Path.Combine(uploadsFolder, uniqueFileName);

                            using (var fileStream = new FileStream(savePath, FileMode.Create))
                            {
                                await matchedImage.CopyToAsync(fileStream);
                            }

                            //podEntry.ImageLink = Path.Combine("UploadedImages", uniqueFileName).Replace("\\", "/");
                            podEntry.ImageLink = "http://192.168.0.158:5000/PODUpload/CUSTOMERID/2025/APRIL/"+ uniqueFileName;
                        }
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
    }

    //public async Task<IActionResult> UploadExcelWithImages(IFormFile excelFile, string? User)
    //{
    //    if (excelFile == null || excelFile.Length == 0)
    //        return BadRequest("No Excel file uploaded.");

    //    var podDataList = new List<PODDataList>();

    //    try
    //    {
    //        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UploadedImages");

    //        // Make sure the folder exists
    //        if (!Directory.Exists(uploadsFolder))
    //        {
    //            Directory.CreateDirectory(uploadsFolder); // Create folder if not exists
    //        }

    //        using (var stream = new MemoryStream())
    //        {
    //            await excelFile.CopyToAsync(stream);
    //            stream.Position = 0;

    //            XSSFWorkbook workbook = new XSSFWorkbook(stream);
    //            ISheet sheet = workbook.GetSheetAt(0);

    //            int rowCount = sheet.LastRowNum;
    //            for (int row = 1; row <= rowCount; row++)
    //            {
    //                IRow currentRow = sheet.GetRow(row);
    //                if (currentRow == null) continue;

    //                string docketNo = currentRow.GetCell(0)?.ToString()?.Trim();
    //                string uploadDateText = currentRow.GetCell(1)?.ToString()?.Trim();
    //                string imageLink = currentRow.GetCell(2)?.ToString()?.Trim();

    //                if (string.IsNullOrEmpty(docketNo))
    //                    continue;

    //                var podEntry = new PODDataList
    //                {
    //                    DocketNo = docketNo,
    //                    UploadDate = (DateTime)(DateTime.TryParse(uploadDateText, out var parsedDate) ? parsedDate : (DateTime?)null),
    //                    ImageLink = null
    //                };

    //                if (!string.IsNullOrEmpty(imageLink) && System.IO.File.Exists(imageLink))
    //                {
    //                    // Create a unique filename
    //                    //var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(imageLink)}";
    //                    var uniqueFileName = $"{podEntry.DocketNo}{Path.GetExtension(imageLink)}";
    //                    var savePath = Path.Combine(uploadsFolder, uniqueFileName);

    //                    // Copy the file to server folder
    //                    System.IO.File.Copy(imageLink, savePath, true);

    //                    // Save only the relative path in DB
    //                    podEntry.ImageLink = Path.Combine("UploadedImages", uniqueFileName).Replace("\\", "/");
    //                }
    //                else
    //                {
    //                    podEntry.ImageLink = null;
    //                }

    //                podDataList.Add(podEntry);
    //            }
    //        }

    //        if (podDataList.Any())
    //        {
    //            var result = await _docketRepository.ImportPOD(podDataList, User);
    //            return Ok(result);
    //        }

    //        return Ok(new { message = "No valid data found in Excel file." });
    //    }
    //    catch (Exception ex)
    //    {
    //        return StatusCode(500, $"Internal server error: {ex.Message}");
    //    }
    //}

 
    [HttpGet("DownloadSampleStatusUpload")]
    public async Task<IActionResult> DownloadTrackingExcel([FromQuery] Guid login)
    {
        var response = await _docketRepository.GetTrackingList("DOCKSTAUS");
        var lsplist = await _customerLspRepository.GetLsps(login);

        if (response == null || response.Data == null || !response.Data.Any())
            return NotFound("No records found for the selected code.");

        if (lsplist == null || lsplist.Data == null || !lsplist.Data.Any())
            return NotFound("No records found for the selected code.");

        using (var workbook = new XLWorkbook())
        {
            var mainSheet = workbook.Worksheets.Add("Main Sheet");
            var listSheet = workbook.Worksheets.Add("DropdownList");

            // Populate dropdown values in a separate sheet
            int row = 1, lsprows = 1;
            foreach (var item in response.Data)
            {
                listSheet.Cell(row, 1).Value = item.CodeId +":"+ item.CodeDesc; // Use item.Code if needed
                row++;
            }
            foreach (var itemlsp in lsplist.Data)
            {
                listSheet.Cell(lsprows, 2).Value = itemlsp.LSPCode +":"+ itemlsp.LspName; // Use item.Code if needed
                lsprows++;
            }

            // Define named range for the list (e.g., A1:A10)
            var listRange = listSheet.Range($"A1:A{response.Data.Count()}");
            listRange.AddToNamed("TrackingOptions");
            var listRangelsp = listSheet.Range($"B1:B{lsplist.Data.Count()}");
            listRangelsp.AddToNamed("LspOptions");

            // Hide the dropdown sheet
            listSheet.Visibility = XLWorksheetVisibility.VeryHidden;

            // Add header to main sheet
            mainSheet.Cell("A1").Value = "LSP Name";
            mainSheet.Cell("B1").Value = "Docket Number";
            mainSheet.Cell("C1").Value = "Next Docket Status";
            mainSheet.Cell("D1").Value = "Status Date";

            // Apply data validation
            var validationStatus = mainSheet.Range("C2:C1048576").CreateDataValidation();
            validationStatus.IgnoreBlanks = true;
            validationStatus.InCellDropdown = true;
            validationStatus.AllowedValues = XLAllowedValues.List;
            validationStatus.List("=TrackingOptions");

            var validationLsp = mainSheet.Range("A2:A1048576").CreateDataValidation();
            validationLsp.IgnoreBlanks = true;
            validationLsp.InCellDropdown = true;
            validationLsp.AllowedValues = XLAllowedValues.List;
            validationLsp.List("=LspOptions");


            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                stream.Position = 0;
                return File(stream.ToArray(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"DocketSatusUpload.xlsx");
            }
        }
    }




}