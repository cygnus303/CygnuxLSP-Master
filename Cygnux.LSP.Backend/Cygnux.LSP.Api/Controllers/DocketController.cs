namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Docket;
using ClosedXML.Excel;
using Cygnux.LSP.Api.Helpers;
using Cygnux.LSP.Api.Hubs;
using Cygnux.LSP.Application.Models.Response;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using NPOI.HPSF;


[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class DocketController : ControllerBase
{
    private readonly IDocketRepository _docketRepository;
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _iconfiguration;
    private readonly ICustomerLspRepository _customerLspRepository;
    private readonly IHubContext<SignalRHub> _hubContext;

    //public DocketController(IDocketRepository docketRepository)
    //{
    //    _docketRepository = docketRepository;
    //}
    public DocketController(IWebHostEnvironment env, IDocketRepository docketRepository, IConfiguration iconfiguration, ICustomerLspRepository customerLspRepository, IHubContext<SignalRHub> hubContext)
    {
        _env = env;
        _docketRepository = docketRepository;
        _iconfiguration = iconfiguration;
        _customerLspRepository = customerLspRepository;
        _hubContext = hubContext;
    }

    [HttpGet]
    [Route("GetDocketList")]
    public async Task<IActionResult> GetDocketList(Guid userId, [FromQuery] Dictionary<string, string> reqFilter)
    {
        return Ok(await _docketRepository.GetDocketList(userId, reqFilter));
    }

    [HttpGet]
    [Route("GetDocketDetail")]
    public async Task<IActionResult> GetDocketDetails(Guid docketId)
    {
        return Ok(await _docketRepository.GetDocketDetails(docketId));
    }

    [HttpGet]
    [Route("GetCityData_Docket")]
    public async Task<IActionResult> GetCityData_Docket(string SearchTerm)
    {
        return Ok(await _docketRepository.GetCityData_Docket(SearchTerm));
    }

    [HttpGet]
    [Route("GetCityData")]
    public async Task<IActionResult> GetCityData(string stcd)
    {
        return Ok(await _docketRepository.GetCityData(stcd));
    }

    [HttpGet]
    [Route("GetStateData")]
    public async Task<IActionResult> GetStateData(string SearchTerm)
    {
        return Ok(await _docketRepository.GetStateData(SearchTerm));
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
        //return Ok(await _docketRepository.AddDocket(createDocketDto));
        var result = await _docketRepository.AddDocket(createDocketDto);
        await _hubContext.Clients.All.SendAsync("DocketUpdated", "Docket Added");
        return Ok(result);
    }

    [HttpPost]
    [Route("UpdateDocket/{id}")]
    public async Task<IActionResult> UpdateDocket(Guid id, CreateDocketRequest createDocketDto)
    {
        //return Ok(await _docketRepository.UpdateDocket(id, createDocketDto));
        var result = await _docketRepository.UpdateDocket(id, createDocketDto);
        await _hubContext.Clients.All.SendAsync("DocketUpdated", "Docket Updated");
        return Ok(result);
    }

    [HttpPost]
    [Route("SingleUpdateDocketSts")]
    public async Task<IActionResult> SingleDocketStsUpdate(Guid DocketId, DocketStatusReq docksts,Guid user)
    {
        //return Ok(await _docketRepository.SingleDocketStsUpdate(DocketId, docksts,user));
        var result = await _docketRepository.SingleDocketStsUpdate(DocketId, docksts, user);
        await _hubContext.Clients.All.SendAsync("DocketUpdated", "Docket Status Updated");
        return Ok(result);
    }

    [HttpPatch]
    [Route("DeleteDocket/{id}")]
    public async Task<IActionResult> DeleteDocket(Guid id)
    {
        //return Ok(await _docketRepository.DeleteDocket(id));
        var result = await _docketRepository.DeleteDocket(id);
        await _hubContext.Clients.All.SendAsync("DocketUpdated", "Docket Deleted");
        return Ok(result);
    }

  [HttpPatch]
    [Route("DocketCancel")]
    public async Task<IActionResult> DocketCancel(Guid id, [FromQuery] Guid userId)
    {
        var response = await _docketRepository.DocketCancel(id, userId);
        return Ok(response);
    }

     [HttpPatch]
    [Route("DocketReject")]
    public async Task<IActionResult> DocketReject([FromBody] DocketRejectRequest request)
    {
        var response = await _docketRepository.DocketReject(request.Id, request.UserId, request.Remarks);
        return Ok(response);
    }

    [HttpGet]
    [Route("GetDropdowndata")]
    public async Task<IActionResult> GetTATdataFrom(Guid CustomerId, Guid? LspId, string? origin, string? destination)
    {
        return Ok(await _docketRepository.GetTATdata(CustomerId, LspId, origin, destination));
    }

    [HttpGet]
    [Route("GetLSPForDocket")]
    public async Task<IActionResult> GetLSPForDocket(string TransportMode,decimal TotalKg,string FromWH,string ToWH,Guid UserId)
    {
        return Ok(await _docketRepository.GetLSPForDocket(TransportMode, TotalKg, FromWH, ToWH, UserId));
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

            mainSheet.Column(4).Style.NumberFormat.Format = "@";
            mainSheet.Cell("D2").SetValue("dd-MM-yyyy");

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
            return Ok(await _docketRepository.GetValidateDocketImportData(data, customerid));
        }
        return Ok();
    }

    [HttpPost]
    [Route("InsertExcelUplaodDocketData")]
    public async Task<IActionResult> InsertDocketData(List<DocketEntryExcelUpload> docketlist, Guid entryBy)
    {
        //return Ok(await _docketRepository.InsertDocketData(docketlist, entryBy));
        var result = await _docketRepository.InsertDocketData(docketlist, entryBy);

        // ✅ Trigger SignalR event after success
        await _hubContext.Clients.All.SendAsync("DocketUpdated", "Docket Imported via Excel");

        return Ok(result);

    }

    [HttpGet("DownloadSampleStatusUpload")]
    public async Task<IActionResult> DownloadTrackingExcel([FromQuery] Guid login)
    {
        var response = await _docketRepository.GetTrackingList("DOCKSTAUS");
        //var lsplist = await _customerLspRepository.GetLsps(login);

        if (response == null || response.Data == null || !response.Data.Any())
            return NotFound("No records found for the selected code.");

        //if (lsplist == null || lsplist.Data == null || !lsplist.Data.Any())
        //    return NotFound("No records found for the selected code.");

        using (var workbook = new XLWorkbook())
        {
            var mainSheet = workbook.Worksheets.Add("Main Sheet");
            var listSheet = workbook.Worksheets.Add("DropdownList");

            // Populate dropdown values in a separate sheet
            int row = 1; //, lsprows = 1;
            foreach (var item in response.Data)
            {
                listSheet.Cell(row, 1).Value = item.CodeId + ":" + item.CodeDesc; // Use item.Code if needed
                row++;
            }
            //foreach (var itemlsp in lsplist.Data)
            //{
            //    listSheet.Cell(lsprows, 2).Value = itemlsp.LSPCode + ":" + itemlsp.LspName; // Use item.Code if needed
            //    lsprows++;
            //}

            // Define named range for the list (e.g., A1:A10)
            var listRange = listSheet.Range($"A1:A{response.Data.Count()}");
            listRange.AddToNamed("TrackingOptions");
            //var listRangelsp = listSheet.Range($"B1:B{lsplist.Data.Count()}");
            //listRangelsp.AddToNamed("LspOptions");

            // Hide the dropdown sheet
            listSheet.Visibility = XLWorksheetVisibility.VeryHidden;

            // Add header to main sheet
            //mainSheet.Cell("A1").Value = "LSP Name";
            mainSheet.Cell("A1").Value = "Docket Number";
            mainSheet.Cell("B1").Value = "Next Docket Status";
            mainSheet.Cell("C1").Value = "Status Date";

            // Apply data validation
            var validationStatus = mainSheet.Range("B2:B1048576").CreateDataValidation();
            validationStatus.IgnoreBlanks = true;
            validationStatus.InCellDropdown = true;
            validationStatus.AllowedValues = XLAllowedValues.List;
            validationStatus.List("=TrackingOptions");

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
                    $"DocketSatusUpload.xlsx");
            }
        }
    }

    [HttpPost]
    [Route("ValidateDocketStatus")]
    public async Task<IActionResult> GetValidateDocketStatusUpdateData(IFormFile file, Guid Lspid)
    {
        var data = ExcelReadHelper.ExtractAllRows(file);
        if (data is not null)
        {
            return Ok(await _docketRepository.GetValidateDocketStatusUpdateData(data, Lspid));
        }
        return Ok();
    }

    [HttpPost]
    [Route("UpdateDocketStatus")]
    public async Task<IActionResult> UpdateDocketStatus(List<DocketStatusUpdate> docketstslist, Guid entryBy)
    {
        //return Ok(await _docketRepository.UpdateDocketStatus(docketstslist, entryBy));
        var result = await _docketRepository.UpdateDocketStatus(docketstslist, entryBy);

        // ✅ Fire SignalR event after status update
        await _hubContext.Clients.All.SendAsync("DocketUpdated", "Docket Status Updated via Excel");

        return Ok(result);
    }


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
    public async Task<IActionResult> ValidatePODUplaodData(IFormFile file, List<IFormFile> images, Guid lspuser)
    {
        if (file == null || images == null || !images.Any())
            return BadRequest("Excel file and image list are required.");

        // 1. Parse Excel to JSON
        var docketData = ExcelReadHelper.ExtractAllRows(file); // This should return a List<YourDocketModel>
        if (docketData == null || !docketData.Any())
            return BadRequest("Invalid or empty Excel data.");

        string jsonDocketData = JsonConvert.SerializeObject(docketData);

        // 2. Extract image file names only
        var imageNames = images.Select(img => img.FileName).ToList();
        string jsonImageNames = JsonConvert.SerializeObject(imageNames);

        // 3. Call Repository to execute SQL procedure
        var result = await _docketRepository.ValidatePODUplaodData(jsonDocketData, jsonImageNames, lspuser);

        return Ok(result);
    }


    [HttpPost]
    [Route("ImportPOD")]
    public async Task<IActionResult> ImportPOD([FromForm] string docketJson, [FromForm] List<IFormFile> imgfiles, [FromForm] Guid User)
    {
        var allowedExtensions = new[] { ".png", ".jpeg", ".jpg", ".tiff", ".tif" };
        var dockets = JsonConvert.DeserializeObject<List<ValidatePODResponse>>(docketJson);
        var podDataList = new List<PODDataList>();

        foreach (var docket in dockets.Where(d => d.IsValid == true))
        {
            // Find all images for this DocketNo
            var matchingFiles = imgfiles
                .Where(f => Path.GetFileNameWithoutExtension(f.FileName).StartsWith(docket.DocketNo, StringComparison.OrdinalIgnoreCase))
                .ToList();

            if (!matchingFiles.Any())
                continue; // Skip if no images available for this docket

            // Validate extensions
            matchingFiles = matchingFiles
                .Where(f => allowedExtensions.Contains(Path.GetExtension(f.FileName).ToLower()))
                .ToList();

            if (!matchingFiles.Any())
                continue; // Skip if no valid extension images

            // Sort images alphabetically
            matchingFiles = matchingFiles.OrderBy(f => f.FileName).ToList();

            // Financial Year and folder structure
            DateTime currentDate = DateTime.Now;
            int year = currentDate.Month >= 4 ? currentDate.Year : currentDate.Year - 1;
            var finyear = $"{year}-{(year + 1).ToString().Substring(2)}";
            var month = currentDate.ToString("MMMM").ToUpper();

            var customerId = (docket.CustomerId ?? Guid.Empty).ToString();
            var lspId = docket.LSPId.ToString();

            var uploadRoot = _iconfiguration.GetValue<string>("ImagePath");
            var uploadFolder = Path.Combine(uploadRoot, customerId, lspId, finyear, month);

            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            string frontFileName = null, backFileName = null;
            string podLink = null, podLinkBack = null;

            // Save front image (first image)
            var frontImageFile = matchingFiles[0];
            var frontExtension = Path.GetExtension(frontImageFile.FileName).ToLower();
            frontFileName = $"{docket.DocketNo}{frontExtension}";
            var frontSavePath = Path.Combine(uploadFolder, frontFileName);
            using (var stream = new FileStream(frontSavePath, FileMode.Create))
            {
                await frontImageFile.CopyToAsync(stream);
            }

            // If second image exists, save as back
            if (matchingFiles.Count > 1)
            {
                var backImageFile = matchingFiles[1];
                var backExtension = Path.GetExtension(backImageFile.FileName).ToLower();
                backFileName = $"{docket.DocketNo}(1){backExtension}";
                var backSavePath = Path.Combine(uploadFolder, backFileName);
                using (var stream = new FileStream(backSavePath, FileMode.Create))
                {
                    await backImageFile.CopyToAsync(stream);
                }
            }

            // Generate public URLs
            var baseUrl = $"{Request.Scheme}://{Request.Host}/PODUpload/{customerId}/{lspId}/{finyear}/{month}";
            podLink = $"{baseUrl}/{frontFileName}";
            if (backFileName != null)
                podLinkBack = $"{baseUrl}/{backFileName}";

            var podDetail = new PODDataList
            {
                DocketNo = docket.DocketNo,
                CustomerId = docket.CustomerId ?? Guid.Empty,
                LspId = docket.LSPId,
                PODFileName = frontFileName,
                PODLink = podLink,
                PODLinkBack = podLinkBack,
                EntryBy = User.ToString()
            };

            podDataList.Add(podDetail);
        }

        if (podDataList.Any())
        {
            var result = await _docketRepository.ImportPOD(podDataList, User);
            return Ok(result);
        }

        return Ok(new { message = "Success" });
    }


    //public async Task<IActionResult> ImportPOD([FromForm] string docketJson, [FromForm] List<IFormFile> imgfiles, [FromForm] Guid User)
    //{
    //    var allowedExtensions = new[] { ".png", ".jpeg", ".jpg", ".tiff", ".tif" };
    //    var dockets = JsonConvert.DeserializeObject<List<ValidatePODResponse>>(docketJson);
    //    var podDataList = new List<PODDataList>();

    //    foreach (var docket in dockets.Where(d => d.IsValid == true))
    //    {
    //        // Find _F and _B images for this DocketNo
    //        var frontImageFile = imgfiles.FirstOrDefault(f => Path.GetFileNameWithoutExtension(f.FileName).Equals($"{docket.DocketNo}_F", StringComparison.OrdinalIgnoreCase));
    //        var backImageFile = imgfiles.FirstOrDefault(f => Path.GetFileNameWithoutExtension(f.FileName).Equals($"{docket.DocketNo}_B", StringComparison.OrdinalIgnoreCase));

    //        if (frontImageFile == null || backImageFile == null)
    //            continue; // Skip if either image is missing

    //        var frontExtension = Path.GetExtension(frontImageFile.FileName).ToLower();
    //        var backExtension = Path.GetExtension(backImageFile.FileName).ToLower();

    //        if (!allowedExtensions.Contains(frontExtension) || !allowedExtensions.Contains(backExtension))
    //            continue; // Skip if extensions are not allowed

    //        // Financial Year
    //        DateTime currentDate = DateTime.Now;
    //        int year = currentDate.Month >= 4 ? currentDate.Year : currentDate.Year - 1;
    //        var finyear = $"{year}-{(year + 1).ToString().Substring(2)}";
    //        var month = currentDate.ToString("MMMM").ToUpper();

    //        // Safe folder structure
    //        var customerId = (docket.CustomerId ?? Guid.Empty).ToString();
    //        var lspId = docket.LSPId.ToString();

    //        var uploadRoot = _iconfiguration.GetValue<string>("ImagePath");
    //        var uploadFolder = Path.Combine(uploadRoot, customerId, lspId, finyear, month);

    //        if (!Directory.Exists(uploadFolder))
    //            Directory.CreateDirectory(uploadFolder);

    //        // Save front image
    //        var frontFileName = $"{docket.DocketNo}_F{frontExtension}";
    //        var frontSavePath = Path.Combine(uploadFolder, frontFileName);
    //        using (var stream = new FileStream(frontSavePath, FileMode.Create))
    //        {
    //            await frontImageFile.CopyToAsync(stream);
    //        }

    //        // Save back image
    //        var backFileName = $"{docket.DocketNo}_B{backExtension}";
    //        var backSavePath = Path.Combine(uploadFolder, backFileName);
    //        using (var stream = new FileStream(backSavePath, FileMode.Create))
    //        {
    //            await backImageFile.CopyToAsync(stream);
    //        }

    //        // Generate public URLs
    //        var baseUrl = $"{Request.Scheme}://{Request.Host}/PODUpload/{customerId}/{lspId}/{finyear}/{month}";
    //        var podLink = $"{baseUrl}/{frontFileName}";
    //        var podLinkBack = $"{baseUrl}/{backFileName}";

    //        var podDetail = new PODDataList
    //        {
    //            DocketNo = docket.DocketNo,
    //            CustomerId = docket.CustomerId ?? Guid.Empty,
    //            LspId = docket.LSPId,
    //            /*POD = podLink,*/                   // front image link
    //            PODFileName = frontFileName,
    //            PODLink = podLink,               // front link
    //            PODLinkBack = podLinkBack,       // back link
    //            EntryBy = User.ToString()
    //        };

    //        podDataList.Add(podDetail);
    //    }

    //    if (podDataList.Any())
    //    {
    //        var result = await _docketRepository.ImportPOD(podDataList, User);
    //        return Ok(result);
    //    }

    //    return Ok(new { message = "Success" });
    //}

    //public async Task<IActionResult> ImportPOD([FromForm] string docketJson, [FromForm] List<IFormFile> imgfiles, [FromForm]  Guid User)
    //{
    //    var allowedExtensions = new[] { ".png", ".jpeg", ".jpg", ".tiff",".tif" };
    //    var dockets = JsonConvert.DeserializeObject<List<ValidatePODResponse>>(docketJson);
    //    var podDataList = new List<PODDataList>();

    //    foreach (var docket in dockets.Where(d => d.IsValid == true))
    //    {
    //        var imageFile = imgfiles.FirstOrDefault(f => f.FileName == docket.ImageName);
    //        if (imageFile == null || Path.GetFileNameWithoutExtension(docket.ImageName) != docket.DocketNo)
    //            continue;

    //        var extension = Path.GetExtension(imageFile.FileName).ToLower();
    //        if (!allowedExtensions.Contains(extension))
    //            continue;

    //        // Financial Year
    //        DateTime currentDate = DateTime.Now;
    //        int year = currentDate.Month >= 4 ? currentDate.Year : currentDate.Year - 1;
    //        var finyear = $"{year}-{(year + 1).ToString().Substring(2)}";
    //        var month = currentDate.ToString("MMMM").ToUpper();

    //        // Safe IDs for folder names
    //        var customerId = (docket.CustomerId ?? Guid.Empty).ToString();
    //        var lspId = docket.LSPId.ToString();

    //        // Build server file path
    //        var uploadRoot = _iconfiguration.GetValue<string>("ImagePath"); // Physical root path
    //        var uploadFolder = Path.Combine(uploadRoot, customerId, lspId, finyear, month);

    //        // Ensure directory exists
    //        if (!Directory.Exists(uploadFolder))
    //            Directory.CreateDirectory(uploadFolder);

    //        // Save image with unique name
    //        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
    //        var savePath = Path.Combine(uploadFolder, docket.ImageName);

    //        using (var stream = new FileStream(savePath, FileMode.Create))
    //        {
    //            await imageFile.CopyToAsync(stream);
    //        }

    //        // Generate public access URL
    //        var podLink = $"{Request.Scheme}://{Request.Host}/PODUpload/{customerId}/{lspId}/{finyear}/{month}/{docket.ImageName}";

    //        // Add to list for DB insert
    //        var podDetail = new PODDataList
    //        {
    //            DocketNo = docket.DocketNo,
    //            CustomerId = docket.CustomerId ?? Guid.Empty,
    //            LspId = docket.LSPId,
    //            /*POD = uniqueFileName,*/
    //            POD = docket.ImageLink,
    //            PODFileName = docket.ImageName,
    //            PODLink = podLink
    //        };

    //        podDataList.Add(podDetail);
    //    }

    //    if (podDataList.Any())
    //    {
    //        var result = await _docketRepository.ImportPOD(podDataList, User);
    //        return Ok(result);
    //    }

    //    return Ok(new { message = "Success" });
    //}

    [HttpPost]
    [Route("SinglePODUpload")]
    public async Task<IActionResult> SinglePODUploadFile(IFormFile imageFile,string docketNo, [FromForm] string docpodJson,Guid lspuser)
    {
        if (imageFile == null || imageFile.Length == 0)
            /*return BadRequest("No image file uploaded.");*/
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "No image file uploaded.",
                Data = false
            });

        var allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".tiff", ".tif" };
        var fileExtension = Path.GetExtension(imageFile.FileName).ToLower();

        if (!allowedExtensions.Contains(fileExtension))
            /*return BadRequest("Invalid file extension. Allowed: .png, .jpg, .jpeg, .tiff, .tif");*/
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = "Invalid file extension. Allowed: .png, .jpg, .jpeg, .tiff, .tif",
                Data = false
            });

        var docpodData = JsonConvert.DeserializeObject<DocketPODUploadReq>(docpodJson);

        // Validate filename matches DocketNo
        var fileNameWithoutExt = Path.GetFileNameWithoutExtension(imageFile.FileName);
        if (!fileNameWithoutExt.Equals(docketNo, StringComparison.OrdinalIgnoreCase))
            /*return BadRequest($"Image filename must match the docket number (expected: {docketNo}).");*/
            return BadRequest(new BaseResponseError<bool>
            {
                Status = false,
                Message = $"Image filename must match the docket number (expected: {docketNo}).",
                Data = false
            });

        // Financial year logic
        DateTime currentDate = DateTime.Now;
        int year = currentDate.Month >= 4 ? currentDate.Year : currentDate.Year - 1;
        string finYear = $"{year}-{(year + 1).ToString().Substring(2)}";
        string month = currentDate.ToString("MMMM").ToUpper();

        // Paths
        string customerIdStr = (docpodData.CustomerId ?? Guid.Empty).ToString();
        string lspIdStr = (docpodData.LspId ?? Guid.Empty).ToString();

        string? rootPath = _iconfiguration.GetValue<string>("ImagePath");
        string fullPath = Path.Combine(rootPath, customerIdStr, lspIdStr, finYear, month);

        if (!Directory.Exists(fullPath))
            Directory.CreateDirectory(fullPath);

        // Save file
        string savedFilePath = Path.Combine(fullPath, imageFile.FileName);
        using (var stream = new FileStream(savedFilePath, FileMode.Create))
        {
            await imageFile.CopyToAsync(stream);
        }

        // Image public URL
        string imageUrl = $"{Request.Scheme}://{Request.Host}/PODUpload/{customerIdStr}/{lspIdStr}/{finYear}/{month}/{imageFile.FileName}";

        // Build DTO
        var docpod = new DocketPODUploadReq
        {
            LspId = docpodData.LspId,
            CustomerId = docpodData.CustomerId,
            PODFileName = imageFile.FileName,
            PODLink = imageUrl,
            UploadDate = docpodData.UploadDate
        };

        var result = await _docketRepository.SinglePODUploadFile(docketNo, docpod, lspuser);
        return Ok(result);
    }

    [HttpGet]
    [Route("DownloadDocket")]
    public async Task<IActionResult> DownloadDocket([FromQuery] Guid userId)
    {
        return Ok(await _docketRepository.DownloadDocket(userId));
    }



}

