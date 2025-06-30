namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Customer;
using DocumentFormat.OpenXml.Office2010.Excel;
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
    [Route("GetCustomerList")]
    public async Task<IActionResult> GetCustomerList(Guid userId,[FromQuery] Dictionary<string, string> json)
    {
        return Ok(await _customerRepository.GetCustomerList(userId,json));
    }

    [HttpGet]
    [Route("GetCustomerDetail")]
    public async Task<IActionResult> GetCustomerDetails(Guid custId, Guid userId)
    {
        return Ok(await _customerRepository.GetCustomerDetails(custId,userId));
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

    [HttpPatch]
    [Route("DeleteCustomer")]
    public async Task<IActionResult> DeleteCustomer(Guid id)
    {
        return Ok(await _customerRepository.DeleteCustomer(id));
    }

    [HttpGet]
    [Route("DeleteCustomerData")]
    public async Task<IActionResult> DeleteCustomerData(Guid custId)
    {
        return Ok(await _customerRepository.DeleteCustomerData(custId));
    }

    [HttpGet]
    [Route("CustomerCount")]
    public async Task<IActionResult> CustomerCount()
    {
        return Ok(await _customerRepository.CustomerCount());
    }
}