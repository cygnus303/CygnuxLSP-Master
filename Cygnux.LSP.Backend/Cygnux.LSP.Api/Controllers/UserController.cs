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
    [Route("GetUserList")]
    public async Task<IActionResult> GetUserList(Guid userId, [FromQuery] Dictionary<string, string> reqFilter)
    {
        return Ok(await _userRepository.GetUserList(userId,reqFilter));
    }

    [HttpGet]
    [Route("GetUserDetail")]
    public async Task<IActionResult> GetUserDetails(Guid id)
    {
        return Ok(await _userRepository.GetUserDetails(id));
    }

    [HttpPost]
    [Route("AddUser")]
    public async Task<IActionResult> AddUser(UserRequest userRequest , Guid user)
    {
        return Ok(await _userRepository.AddUser(userRequest,user));
    }

    [HttpPost]
    [Route("UpdateUser")]
    public async Task<IActionResult> UpdateUser(Guid id, UserRequest userRequest)
    {
        return Ok(await _userRepository.UpdateUser(id, userRequest));
    }


    //[HttpPatch]
    //[Route("DeleteUser")]
    //public async Task<IActionResult> DeleteUser(Guid id, DeleteUserReq deleteUreq)
    //{
    //    return Ok(await _userRepository.DeleteUser(id, deleteUreq));
    //}

    [HttpPatch]
    [Route("DeleteUser")]
    public async Task<IActionResult> DeleteUser(Guid userid)
    {
        return Ok(await _userRepository.DeleteUser(userid));
    }
}