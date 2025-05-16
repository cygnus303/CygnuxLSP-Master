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
using static System.Runtime.InteropServices.JavaScript.JSType;


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
    public async Task<IActionResult> GetDocketList(Guid userId, [FromQuery] Dictionary<string, string> reqFilter)
    {
        return Ok(await _docketRepository.GetDocketList(userId,reqFilter));
    }

    [HttpGet]
    [Route("GetDocketDetail")]
    public async Task<IActionResult> GetDocketDetails(Guid docketId)
    {
        return Ok(await _docketRepository.GetDocketDetails(docketId));
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

    [HttpPost]
    [Route("SingleUpdateDocketSts")]
    public async Task<IActionResult> SingleDocketStsUpdate(Guid DocketId, DocketStatusReq docksts)
    {
        return Ok(await _docketRepository.SingleDocketStsUpdate(DocketId, docksts));
    }

    [HttpPatch]
    [Route("DeleteDocket/{id}")]
    public async Task<IActionResult> DeleteDocket(Guid id)
    {
        return Ok(await _docketRepository.DeleteDocket(id));
    }

    [HttpGet]
    [Route("GetDropdowndata")]
    public async Task<IActionResult> GetTATdataFrom(Guid CustomerId, Guid? LspId, string? origin, string? destination)
    {
        return Ok(await _docketRepository.GetTATdata(CustomerId, LspId, origin, destination));
    }


    [HttpGet("DownloadSampleDocketUpload")]
    public async Task<IActionResult> DownloadDocketUplaodFile([FromQuery] Guid login)
    {
        var transmode = await _docketRepository.GetTrackingList("TRN");
        var lsplist = await _customerLspRepository.GetLsps(login);

        if (transmode == null || transmode.Data == null || !transmode.Data.Any())
            return NotFound("No records found for the Transport mode.");

        if (lsplist == null || lsplist.Data == null || !lsplist.Data.Any())
            return NotFound("No records found for the Lsp list.");

        using (var workbook = new XLWorkbook())
        {
            var mainSheet = workbook.Worksheets.Add("Main Sheet");
            var listSheet = workbook.Worksheets.Add("DropdownList");

            // Populate dropdown values in a separate sheet
            int j = 1, k = 1;
          
            foreach (var itemj in transmode.Data)
            {
                listSheet.Cell(j, 1).Value = itemj.CodeId + ":" + itemj.CodeDesc; 
                j++;
            }
            foreach (var itemk in lsplist.Data)
            {
                listSheet.Cell(k, 2).Value = itemk.LSPCode + ":" + itemk.LspName; 
                k++;
            }

            // Define named range for the list (e.g., A1:A10)
           
            var modeRange = listSheet.Range($"A1:A{transmode.Data.Count()}");
            modeRange.AddToNamed("ModeOption");
            var lspRange = listSheet.Range($"B1:B{lsplist.Data.Count()}");
            lspRange.AddToNamed("LspOption");

            // Hide the dropdown sheet
            listSheet.Visibility = XLWorksheetVisibility.VeryHidden;

            // Add header to main sheet
            mainSheet.Cell("A1").Value = "LSP Name";
            mainSheet.Cell("B1").Value = "Docket No";
            mainSheet.Cell("C1").Value = "Invoice No";
            mainSheet.Cell("D1").Value = "Date";
            mainSheet.Cell("E1").Value = "From Location";
            mainSheet.Cell("F1").Value = "To Location";
            mainSheet.Cell("G1").Value = "Quantity";
            mainSheet.Cell("H1").Value = "Mode of Transporter";

            // Apply data validation
            var validationLsp = mainSheet.Range("A2:A1048576").CreateDataValidation();
            validationLsp.IgnoreBlanks = true;
            validationLsp.InCellDropdown = true;
            validationLsp.AllowedValues = XLAllowedValues.List;
            validationLsp.List("=LspOption");

            var validationStatus = mainSheet.Range("H2:H1048576").CreateDataValidation();
            validationStatus.IgnoreBlanks = true;
            validationStatus.InCellDropdown = true;
            validationStatus.AllowedValues = XLAllowedValues.List;
            validationStatus.List("=ModeOption");

            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                stream.Position = 0;
                return File(stream.ToArray(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"Docket_Upload.xlsx");
            }
        }
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

    [HttpPost]
    [Route("ValidateDocketStatus")]
    public async Task<IActionResult> GetValidateDocketStatusUpdateData(IFormFile file, Guid custId)
    {
        var data = ExcelReadHelper.ExtractAllRows(file);
        if (data is not null)
        {
            return Ok(await _docketRepository.GetValidateDocketStatusUpdateData(data, custId));
        }
        return Ok();
    }

    [HttpPost]
    [Route("UpdateDocketStatus")]
    public async Task<IActionResult> UpdateDocketStatus(List<DocketStatusUpdate> docketstslist, Guid entryBy)
    {
        return Ok(await _docketRepository.UpdateDocketStatus(docketstslist, entryBy));
    }

    //public string GetFinancialYear(DateTime date)
    //{
    //    int year = date.Month >= 4 ? date.Year : date.Year - 1;
    //    return $"{year}-{(year + 1).ToString().Substring(2)}";
    //}

    //public string GetMonthName(DateTime date)
    //{
    //    return date.ToString("MMMM").ToUpper();
    //}


    [HttpGet("DownloadSampleForPODupload")]
    public IActionResult DownloadSamplePODupload([FromQuery] Guid login)
    {
        // var lsplist = await _customerLspRepository.GetLsps(login);

        //if (lsplist == null || lsplist.Data == null || !lsplist.Data.Any())
        //    return NotFound("No records found for the selected code.");

        using (var workbook = new XLWorkbook())
        {
            var mainSheet = workbook.Worksheets.Add("Main Sheet");
            //var listSheet = workbook.Worksheets.Add("DropdownList");

            // Populate dropdown values in column A of the list sheet
            //int lsprows = 1;
            //foreach (var itemlsp in lsplist.Data)
            //{
            //    listSheet.Cell(lsprows, 1).Value = $"{itemlsp.LSPCode}:{itemlsp.LspName}";
            //    lsprows++;
            //}

            // Define named range for LSP dropdown in column A
            //var listRangeLsp = listSheet.Range($"A1:A{lsplist.Data.Count()}");
            //listRangeLsp.AddToNamed("LspOptions");

            // Hide the dropdown list sheet
            //listSheet.Visibility = XLWorksheetVisibility.VeryHidden;

            // Add headers to main sheet
            //mainSheet.Cell("A1").Value = "LSPName";
            mainSheet.Cell("A1").Value = "DocketNo";
            mainSheet.Cell("B1").Value = "UploadDate";
            mainSheet.Cell("C1").Value = "ImageLink";

            // Apply dropdown list validation for LSPName column
            //var validationLsp = mainSheet.Range("A2:A1048576").CreateDataValidation();
            //validationLsp.IgnoreBlanks = true;
            //validationLsp.InCellDropdown = true;
            //validationLsp.AllowedValues = XLAllowedValues.List;
            //validationLsp.List("=LspOptions");

            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                stream.Position = 0;
                return File(stream.ToArray(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "DocketPODUpload.xlsx");
            }
        }
    }

    [HttpPost]
    [Route("ValidatePODUpload")]
    public async Task<IActionResult> ValidatePODUplaodData(IFormFile file, Guid lspuser)
    {
        var data = ExcelReadHelper.ExtractAllRows(file);
        if (data is not null)
        {
            return Ok(await _docketRepository.ValidatePODUplaodData(data, lspuser));
        }
        return Ok();
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
            var uploadsFolder = _iconfiguration.GetValue<string>("ImagePath");

            DateTime currentDate = DateTime.Now;
            int year = currentDate.Month >= 4 ? currentDate.Year : currentDate.Year - 1;
            var finyear = $"{year}-{(year + 1).ToString().Substring(2)}";
            var month = currentDate.ToString("MMMM").ToUpper();

            uploadsFolder = Path.Combine(uploadsFolder, finyear, month, User.ToString());

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

                    string lspName = currentRow.GetCell(0)?.ToString()?.Trim();
                    string docketNo = currentRow.GetCell(1)?.ToString()?.Trim();
                    string uploadDateText = currentRow.GetCell(2)?.ToString()?.Trim();
                    string imageFilePath = currentRow.GetCell(3)?.ToString()?.Trim();

                    if (string.IsNullOrEmpty(docketNo))
                        continue;

                    var podEntry = new PODDataList
                    {
                        LSPName = lspName,
                        DocketNo = docketNo,
                        UploadDate = (DateTime)(DateTime.TryParse(uploadDateText, out var parsedDate) ? parsedDate : (DateTime?)null),
                        ImageLink = null
                    };

                    if (!string.IsNullOrEmpty(imageFilePath))
                    {
                        string imageFileName = Path.GetFileName(imageFilePath);

                        var matchedImage = imageFiles.FirstOrDefault(f =>
                            Path.GetFileName(f.FileName).Equals(imageFileName, StringComparison.OrdinalIgnoreCase));

                        if (matchedImage != null)
                        {
                            //var uniqueFileName = $"{docketNo}{Path.GetExtension(matchedImage.FileName)}";
                            var uniqueFileName = $"{Path.GetExtension(matchedImage.FileName)}";
                            var savePath = Path.Combine(uploadsFolder, uniqueFileName);

                            using (var fileStream = new FileStream(savePath, FileMode.Create))
                            {
                                await matchedImage.CopyToAsync(fileStream);
                            }

                            podEntry.ImageLink = $"http://192.168.0.158:5000/PODUpload/{finyear.Split('-')[0]}/{month}/{User.ToString()}/{uniqueFileName}";
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

}