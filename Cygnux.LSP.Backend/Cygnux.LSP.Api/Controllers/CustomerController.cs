namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Customer;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly ICustomerRepository _customerRepository;

    public CustomerController(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetCustomerList(string? customerCode, [FromQuery] int page, [FromQuery] int pageSize, Guid userId, string? CustomerName, string? EmailId)
    {
        return Ok(await _customerRepository.GetCustomerList(customerCode,page, pageSize, userId, CustomerName,EmailId));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetCustomerDetails(string id,Guid userId)
    {
        return Ok(await _customerRepository.GetCustomerDetails(id,userId));
    }

    [HttpPost]
    public async Task<IActionResult> AddCustomer(CreateCustomerRequest createCustomerDto)
    {
        return Ok(await _customerRepository.AddCustomer(createCustomerDto));
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> UpdateCustomer(string id, CreateCustomerRequest createCustomerDto)
    {
        return Ok(await _customerRepository.UpdateCustomer(id, createCustomerDto));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> DeleteCustomer(string id)
    {
        return Ok(await _customerRepository.DeleteCustomer(id));
    }
}