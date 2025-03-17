namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Customer;
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
    public async Task<IActionResult> GetCustomerList([FromQuery] int page, [FromQuery] int pageSize)
    {
        return Ok(await _customerRepository.GetCustomerList(page, pageSize));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetCustomerDetails(string id)
    {
        return Ok(await _customerRepository.GetCustomerDetails(id));
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