namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Customer;
using Cygnux.LSP.Api.Hubs;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IHubContext<SignalRHub> _hubContext;

    public CustomerController(ICustomerRepository customerRepository, IHubContext<SignalRHub> hubContext)
    {
        _customerRepository = customerRepository;
        _hubContext = hubContext;
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
        //return Ok(await _customerRepository.AddCustomer(createCustomerDto));
        var result = await _customerRepository.AddCustomer(createCustomerDto);
        await _hubContext.Clients.All.SendAsync("CustomerListUpdated", "Customer Added");
        await _hubContext.Clients.All.SendAsync("CustomerCountUpdated");
        return Ok(result);
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> UpdateCustomer(string id, CreateCustomerRequest createCustomerDto)
    {
        //return Ok(await _customerRepository.UpdateCustomer(id, createCustomerDto));
        var result = await _customerRepository.UpdateCustomer(id, createCustomerDto);
        await _hubContext.Clients.All.SendAsync("CustomerListUpdated", "Customer Updated");
        await _hubContext.Clients.All.SendAsync("CustomerCountUpdated");
        return Ok(result);
    }

    [HttpPatch]
    [Route("DeleteCustomer")]
    public async Task<IActionResult> DeleteCustomer(Guid id)
    {
        //return Ok(await _customerRepository.DeleteCustomer(id));
        var result = await _customerRepository.DeleteCustomer(id);
        await _hubContext.Clients.All.SendAsync("CustomerListUpdated", "Customer Deleted");
        await _hubContext.Clients.All.SendAsync("CustomerCountUpdated");

        return Ok(result);
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

    [HttpGet]
    [Route("CheckCustomerData")]
    public async Task<IActionResult> CheckCustomerData(Guid custId)
    {
        return Ok(await _customerRepository.CheckCustomerData(custId));
    }

    [HttpGet]
    [Route("Customers")]
    public async Task<IActionResult> Customers(Guid userId)
    {
        return Ok(await _customerRepository.Customers(userId));
    }

    [HttpGet]
    [Route("DownloadCustomer")]
    public async Task<IActionResult> DownloadCustomer([FromQuery] Guid userId)
    {
        return Ok(await _customerRepository.DownloadCustomer(userId));
    }
}