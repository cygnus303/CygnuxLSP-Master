namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.CustomerLSPTAT;
using Application.Models.Request.LspMapping;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class CustomerLspController : ControllerBase
{
    private readonly ICustomerLspRepository _customerLspRepository;

    public CustomerLspController(ICustomerLspRepository customerLspRepository)
    {
        _customerLspRepository = customerLspRepository;
    }

    [HttpGet]
    [Route("Tat")]
    public async Task<IActionResult> GetLspTatList([FromQuery] int page, [FromQuery] int pageSize,Guid userId,string? customerName,string? lspName,string? product,string? origin,string?destination,int? tat,string? modeDescription)
    {
        return Ok(await _customerLspRepository.GetLspTatList(Guid.NewGuid(), page, pageSize, userId,customerName,lspName,product,origin,destination,tat, modeDescription));
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

    //[HttpGet]
    //public async Task<IActionResult> GetLspMappingList([FromQuery] int page, [FromQuery] int pageSize,Guid userId, string? customerName, string? lspName)
    //{
    //    return Ok(await _customerLspRepository.GetLspMappingList(Guid.NewGuid(), page, pageSize, userId,customerName,lspName));
    //}
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

    [HttpPost]
    [Route("AddLspMap")]
    public async Task<IActionResult> AddLspMapping(CreateLspMappingRequest createLspMapping)
    {
        return Ok(await _customerLspRepository.AddLspMapping(createLspMapping));
    }

    [HttpPost]
    [Route("UpdateLspMap")]
    public async Task<IActionResult> UpdateLspMapping(Guid LspMapId, CreateLspMappingRequest createLspMapping)
    {
        return Ok(await _customerLspRepository.UpdateLspMapping(LspMapId, createLspMapping));
    }

    [HttpPatch]
    [Route("{id}")]
    public async Task<IActionResult> DeleteLspMapping(Guid id)
    {
        return Ok(await _customerLspRepository.DeleteLspMapping(id));
    }

    [HttpPost]
    [Route("Tat")]
    public async Task<IActionResult> AddCustomerLspTat(CreateCustomerLspTatRequest addEditCustomerLspTat)
    {
        return Ok(await _customerLspRepository.AddCustomerLspTat(addEditCustomerLspTat));
    }

    [HttpPost]
    [Route("Tat/{id}")]
    public async Task<IActionResult> UpadateCustomerLspTat(string id, CreateCustomerLspTatRequest addEditCustomerLspTat)
    {
        return Ok(await _customerLspRepository.UpdateCustomerLspTat(id, addEditCustomerLspTat));
    }

    [HttpPatch]
    [Route("Tat/{id}")]
    public async Task<IActionResult> DeleteLspMappingTat(Guid id)
    {
        return Ok(await _customerLspRepository.DeleteLspMappingTat(id));
    }
}