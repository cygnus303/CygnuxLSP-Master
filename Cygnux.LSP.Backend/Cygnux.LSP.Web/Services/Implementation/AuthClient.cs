using CygnuxLSP.Web.Helper;
using CygnuxLSP.Web.Models;
using CygnuxLSP.Web.Models.Common;
using CygnuxLSP.Web.Response;
using CygnuxLSP.Web.Services.Interfaces;
using System.Net.Http;
using System.Text.Json;

namespace CygnuxLSP.Web.Services.Implementation
{
    public class AuthClient : IAuthClient
    {
        private readonly HttpClient _httpClient;
        private readonly JsonSerializerOptions _deserializeOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="httpClient">HttpClient instance</param>
        public AuthClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("ApiKey", "D31950B5-743C-4A05-AF5D-62EA494C5C1B");
        }

        /// <summary>
        /// Login method
        /// </summary>
        /// <param name="user">User login viewModel</param>
        /// <returns>Authentication response with token</returns>
        public async Task<APIResponse<AuthResponse>> Login(UserLogin user)
        {
            using var httpResponse = await _httpClient.PostAsync("/V1/Authentication/Login", GenericHelper.GetStringContent(user));
            return JsonSerializer.Deserialize<APIResponse<AuthResponse>>(httpResponse.Content.ReadAsStringAsync().Result, _deserializeOptions);
        }

        /// <summary>
        /// Register method
        /// </summary>
        /// <param name="user">User viewModel</param>
        /// <returns>Authentication response with token</returns>
        public async Task<APIResponse<GeneralDbResponse>> Register(CreateUser user)
        {
            using var httpResponse = await _httpClient.PostAsync("/V1/Account/Register", GenericHelper.GetStringContent(user));
            return JsonSerializer.Deserialize<APIResponse<GeneralDbResponse>>(httpResponse.Content.ReadAsStringAsync().Result, _deserializeOptions);
        }
    }
}
