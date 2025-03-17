using CygnuxLSP.Web.Models;
using CygnuxLSP.Web.Models.Common;
using CygnuxLSP.Web.Response;

namespace CygnuxLSP.Web.Services.Interfaces
{
    public interface IAuthClient
    {
        /// <summary>
        /// Login method
        /// </summary>
        /// <param name="user">User login viewModel</param>
        /// <returns>Authentication response with token</returns>
        Task<APIResponse<AuthResponse>> Login(UserLogin user);

        /// <summary>
        /// Register method
        /// </summary>
        /// <param name="user">User Model</param>
        /// <returns>Authentication response with token</returns>
        Task<APIResponse<GeneralDbResponse>> Register(CreateUser user);
        //Task<APIResponse<TBL_Master_User>> UserDetails(string id);
        //Task<APIResponse<List<TBL_Master_User>>> GetUserList();
    }
}
