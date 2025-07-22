namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Customer;
using Cygnux.LSP.Api.Hubs;
using Cygnux.LSP.Application.Models.Response;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IHubContext<SignalRHub> _hubContext;
    private readonly IConfiguration _iconfiguration;

    public CustomerController(ICustomerRepository customerRepository, IHubContext<SignalRHub> hubContext, IConfiguration iconfiguration)
    {
        _customerRepository = customerRepository;
        _hubContext = hubContext;
        _iconfiguration = iconfiguration;
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
    public async Task<IActionResult> AddCustomer(string CustomerJson, IFormFile? imageFile)
    {
        var createCustomerDto = JsonConvert.DeserializeObject<CreateCustomerRequest>(CustomerJson);
        // Validate image (optional)
        if (imageFile != null)
        {
            var allowedExtensions = new[] { ".png", ".jpg", ".jpeg" };
            var fileExtension = Path.GetExtension(imageFile.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest(new BaseResponseError<bool>
                {
                    Status = false,
                    Message = "Invalid file extension. Allowed: .png, .jpg, .jpeg",
                    Data = false
                });
            }
             
            // Generate path using CustomerName or CustomerCode
            var customerId = createCustomerDto.CustomerCode ?? Guid.NewGuid().ToString();
            var currentDate = DateTime.Now;
            var year = currentDate.Month >= 4 ? currentDate.Year : currentDate.Year - 1;
            var finYear = $"{year}-{(year + 1).ToString().Substring(2)}";
            var month = currentDate.ToString("MMMM").ToUpper();

            string? rootPath = _iconfiguration.GetValue<string>("ImagePath");
            var fullPath = Path.Combine(rootPath, "Customer", customerId);

            if (!Directory.Exists(fullPath))
                Directory.CreateDirectory(fullPath);

            var savedFilePath = Path.Combine(fullPath, imageFile.FileName);
            using (var stream = new FileStream(savedFilePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            var imageUrl = $"{Request.Scheme}://{Request.Host}/Customer/{customerId}/{imageFile.FileName}";
            createCustomerDto.LogoLink = imageUrl; // Save image URL in the request model
        }
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