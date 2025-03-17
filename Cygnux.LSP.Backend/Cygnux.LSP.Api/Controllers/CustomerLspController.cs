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
    public async Task<IActionResult> GetLspTatList([FromQuery] int page, [FromQuery] int pageSize)
    {
        return Ok(await _customerLspRepository.GetLspTatList(Guid.NewGuid(), page, pageSize));
    }

    [HttpGet]
    [Route("Tat/Customers")]
    public async Task<IActionResult> GetCustomers()
    {
        return Ok(await _customerLspRepository.GetCustomers());
    }

    [HttpGet]
    [Route("Tat/Lsps")]
    public async Task<IActionResult> GetLsps()
    {
        return Ok(await _customerLspRepository.GetLsps());
    }

    [HttpGet]
    [Route("Tat/{id}")]
    public async Task<IActionResult> GetLspTatDetails(string id)
    {
        return Ok(await _customerLspRepository.GetLspTatDetails(id));
    }

    [HttpGet]
    public async Task<IActionResult> GetLspMappingList([FromQuery] int page, [FromQuery] int pageSize)
    {
        return Ok(await _customerLspRepository.GetLspMappingList(Guid.NewGuid(), page, pageSize));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetLspMappingDetails(Guid id)
    {
        return Ok(await _customerLspRepository.GetLspMappingDetails(id));
    }

    [HttpPost]
    public async Task<IActionResult> AddLspMapping(CreateLspMappingRequest createLspMapping)
    {
        return Ok(await _customerLspRepository.AddLspMapping(createLspMapping));
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> UpdateLspMapping(Guid id, CreateLspMappingRequest createLspMapping)
    {
        return Ok(await _customerLspRepository.UpdateLspMapping(id, createLspMapping));
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