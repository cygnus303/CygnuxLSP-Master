namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.CustomerLSPTAT;
using Application.Models.Request.LspMapping;
using ClosedXML.Excel;
using Cygnux.LSP.Api.Helpers;
using Cygnux.LSP.Api.Hubs;
using Cygnux.LSP.Infrastructure.Models.Response.Docket;
using Cygnux.LSP.Infrastructure.Models.Response.LspMapping;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class CustomerLspController : ControllerBase
{
    private readonly ICustomerLspRepository _customerLspRepository;
    private readonly IHubContext<SignalRHub> _hubContext;

    public CustomerLspController(ICustomerLspRepository customerLspRepository, IHubContext<SignalRHub> hubContext)
    {
        _customerLspRepository = customerLspRepository;
        _hubContext = hubContext;
    }

    [HttpGet]
    [Route("Tat")]
    public async Task<IActionResult> GetLspTatList([FromQuery] int page, [FromQuery] int pageSize,Guid userId,string? customerName,string? lspName,string? product,string? origin,string?destination,int? tat,string? modeDescription)
    {
        return Ok(await _customerLspRepository.GetLspTatList(Guid.NewGuid(), page, pageSize, userId,customerName,lspName,product,origin,destination,tat, modeDescription));
    }

    [HttpGet]
    [Route("Tat/DownloadLspTat")]
    public async Task<IActionResult> DownloadLspTat([FromQuery] Guid userId)
    {
        return Ok(await _customerLspRepository.DownloadLspTat(userId));
    }

    [HttpGet]
    [Route("Tat/Customers")]
    public async Task<IActionResult> GetCustomers(Guid loginid)
    {
        return Ok(await _customerLspRepository.GetCustomers(loginid));
    }

    [HttpGet]
    [Route("Tat/Lsps")]
    public async Task<IActionResult> GetLsps(Guid login)
    {
        return Ok(await _customerLspRepository.GetLsps(login));
    }

    [HttpGet]
    [Route("Tat/LspTatDetail")]
    public async Task<IActionResult> GetLspTatDetails(Guid Id)
    {
        return Ok(await _customerLspRepository.GetLspTatDetails(Id));
    }

    [HttpGet]
    [Route("CustomerLspMappingList")]
    public async Task<IActionResult> GetLspMappingList(Guid Id, [FromQuery] Dictionary<string, string> filters)
    {
        return Ok(await _customerLspRepository.GetLspMappingList(Id, filters));
    }

    [HttpGet]
    [Route("CustomerLspMappingDetails")]
    public async Task<IActionResult> GetLspMappingDetails(Guid Id)
    {
        return Ok(await _customerLspRepository.GetLspMappingDetails(Id));
    }

    [HttpGet]
    [Route("LspMappingCount")]
    public async Task<IActionResult> LspMappingCount(Guid userId)
    {
        return Ok(await _customerLspRepository.LspMappingCount(userId));
    }

    [HttpPost]
    [Route("AddLspMap")]
    public async Task<IActionResult> AddLspMapping(CreateLspMappingRequest createLspMapping)
    {
        // return Ok(await _customerLspRepository.AddLspMapping(createLspMapping));

        var result = await _customerLspRepository.AddLspMapping(createLspMapping);

        if (result != null)
        {
            await _hubContext.Clients.All.SendAsync("LspMappingListUpdated", "LSP Mapping Added");
            await _hubContext.Clients.All.SendAsync("LspMappingCountUpdated");
        }

        return Ok(result);
    }

    [HttpPost]
    [Route("UpdateLspMap")]
    public async Task<IActionResult> UpdateLspMapping(Guid LspMapId, CreateLspMappingRequest createLspMapping)
    {
        // return Ok(await _customerLspRepository.UpdateLspMapping(LspMapId, createLspMapping));

        var result = await _customerLspRepository.UpdateLspMapping(LspMapId, createLspMapping);
        await _hubContext.Clients.All.SendAsync("LspMappingListUpdated", "LSP Mapping Updated");
        await _hubContext.Clients.All.SendAsync("LspMappingCountUpdated");
        return Ok(result);
    }

    [HttpPatch]
    [Route("DeleteLSPMap")]
    public async Task<IActionResult> DeleteLspMapping(Guid CustomerLspId)
    {
        // return Ok(await _customerLspRepository.DeleteLspMapping(CustomerLspId));

        var result = await _customerLspRepository.DeleteLspMapping(CustomerLspId);
        await _hubContext.Clients.All.SendAsync("LspMappingListUpdated", "LSP Mapping Deleted");
        await _hubContext.Clients.All.SendAsync("LspMappingCountUpdated");
        return Ok(result);
    }


    [HttpPost]
    [Route("Tat")]
    public async Task<IActionResult> AddCustomerLspTat(CreateCustomerLspTatRequest addEditCustomerLspTat)
    {
        // return Ok(await _customerLspRepository.AddCustomerLspTat(addEditCustomerLspTat));

        var result = await _customerLspRepository.AddCustomerLspTat(addEditCustomerLspTat);
        await _hubContext.Clients.All.SendAsync("TatListUpdated", "TAT Added");
        await _hubContext.Clients.All.SendAsync("LspTatCountUpdated");
        return Ok(result);
    }

    [HttpGet]
    [Route("Tat/LspTatCount")]
    public async Task<IActionResult> LspTatCount(Guid userId)
    {
        return Ok(await _customerLspRepository.LspTatCount(userId));
    }


    [HttpPost]
    [Route("Tat/{id}")]
    public async Task<IActionResult> UpadateCustomerLspTat(string id, CreateCustomerLspTatRequest addEditCustomerLspTat)
    {
        // return Ok(await _customerLspRepository.UpdateCustomerLspTat(id, addEditCustomerLspTat));

        var result = await _customerLspRepository.UpdateCustomerLspTat(id, addEditCustomerLspTat);
        await _hubContext.Clients.All.SendAsync("TatListUpdated", "TAT Updated");
        await _hubContext.Clients.All.SendAsync("LspTatCountUpdated");
        return Ok(result);
    }

    [HttpPatch]
    [Route("Tat/DeleteLSPTAT")]
    public async Task<IActionResult> DeleteLspMappingTat(Guid TatId)
    {
        // return Ok(await _customerLspRepository.DeleteLspMappingTat(TatId));

        var result = await _customerLspRepository.DeleteLspMappingTat(TatId);
        await _hubContext.Clients.All.SendAsync("TatListUpdated", "TAT Deleted");
        await _hubContext.Clients.All.SendAsync("LspTatCountUpdated");
        return Ok(result);
    }

    [HttpGet]
    [Route("GetDeleteCustomerLspMapData")]
    public async Task<IActionResult> DeleteCustomerLspDetail(Guid Id)
    {
        return Ok(await _customerLspRepository.DeleteCustomerLspDetail(Id));
    }
    [HttpGet]
    [Route("Tat/GetDeleteCustomerLspTATData")]
    public async Task<IActionResult> DeleteCustomerLspTATDetail(Guid Id)
    {
        return Ok(await _customerLspRepository.DeleteCustomerLspTATDetail(Id));
    }

    [HttpGet]
    [Route("DownloadLspMapping")]
    public async Task<IActionResult> DownloadLspMapping([FromQuery] Guid userId)
    {
        return Ok(await _customerLspRepository.DownloadLspMapping(userId));
    }


    [HttpPost]
    [Route("ValidateLspTatData")]
    public async Task<IActionResult> ValidateLspTatData(IFormFile file)
    {
        var data = ExcelReadHelper.ExtractAllRows(file);
        if (data is not null)
        {
            return Ok(await _customerLspRepository.GetTATdata(data));
        }
        return Ok();
    }

    [HttpPost]
    [Route("InsertExcelUplaodLaspTatData")]
    public async Task<IActionResult> InsertDocketData(List<CustomerLspTatRequest> lsptatlist, Guid entryBy)
    {
        var result = await _customerLspRepository.InsertLspTatData(lsptatlist, entryBy);

        // ✅ Trigger SignalR event after success
        await _hubContext.Clients.All.SendAsync("LspTatUpdate", "LspTat Imported via Excel");

        return Ok(result);

    }

    [HttpGet]
    [Route("LspTat-download-template")]
    public IActionResult DownloadTemplate()
    {
        var columns = new[]
        {
        "CustomerName", "LspName", "Product", "Origin", "Destination",
        "DestinationState", "Priority", "BookingType", "Mode", "TAT"
        };

        using (var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheets.Add("LSP_TAT_Template");

            // Add headers to row 1
            for (int i = 0; i < columns.Length; i++)
            {
                worksheet.Cell(1, i + 1).Value = columns[i];
                worksheet.Cell(1, i + 1).Style.Font.Bold = true;
            }

            // Autofit the columns
            worksheet.Columns().AdjustToContents();

            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                stream.Position = 0;

                return File(
                    stream.ToArray(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "LSP_TAT_Upload_Template.xlsx"
                );
            }
        }
    }

}