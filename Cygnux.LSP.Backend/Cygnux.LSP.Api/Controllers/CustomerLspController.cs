namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.CustomerLSPTAT;
using Application.Models.Request.LspMapping;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Cygnux.LSP.Api.Hubs;

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
        return Ok(result);
    }

    [HttpPatch]
    [Route("DeleteLSPMap")]
    public async Task<IActionResult> DeleteLspMapping(Guid CustomerLspId)
    {
        // return Ok(await _customerLspRepository.DeleteLspMapping(CustomerLspId));

        var result = await _customerLspRepository.DeleteLspMapping(CustomerLspId);
        await _hubContext.Clients.All.SendAsync("LspMappingListUpdated", "LSP Mapping Deleted");
        return Ok(result);
    }


    [HttpPost]
    [Route("Tat")]
    public async Task<IActionResult> AddCustomerLspTat(CreateCustomerLspTatRequest addEditCustomerLspTat)
    {
        // return Ok(await _customerLspRepository.AddCustomerLspTat(addEditCustomerLspTat));

        var result = await _customerLspRepository.AddCustomerLspTat(addEditCustomerLspTat);
        await _hubContext.Clients.All.SendAsync("TatListUpdated", "TAT Added");
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
        return Ok(result);
    }

    [HttpPatch]
    [Route("Tat/DeleteLSPTAT")]
    public async Task<IActionResult> DeleteLspMappingTat(Guid TatId)
    {
        // return Ok(await _customerLspRepository.DeleteLspMappingTat(TatId));

        var result = await _customerLspRepository.DeleteLspMappingTat(TatId);
        await _hubContext.Clients.All.SendAsync("TatListUpdated", "TAT Deleted");
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

}