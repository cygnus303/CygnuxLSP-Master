namespace Cygnux.LSP.Api.Controllers;

using Application.Contracts;
using Application.Models.Request.Identity;
using Microsoft.AspNetCore.Mvc;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UserController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetUserList([FromQuery] int page, [FromQuery] int pageSize)
    {
        return Ok(await _userRepository.GetUserList(page, pageSize));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetUserDetails(Guid id)
    {
        return Ok(await _userRepository.GetUserDetails(id));
    }

    [HttpPost]
    public async Task<IActionResult> AddUser(UserRequest userRequest)
    {
        return Ok(await _userRepository.AddUser(userRequest));
    }

    [HttpPost]
    [Route("{id}")]
    public async Task<IActionResult> UpdateUser(Guid id, UserRequest userRequest)
    {
        return Ok(await _userRepository.UpdateUser(id, userRequest));
    }
}