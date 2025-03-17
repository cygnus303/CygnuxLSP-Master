using CygnuxLSP.Web.Classes;
using CygnuxLSP.Web.Models.Master.Customer;
using CygnuxLSP.Web.Response;
using CygnuxLSP.Web.Services.Interfaces;
using System.Text.Json;

namespace CygnuxLSP.Web.Services.Implementation
{
    public class MasterClient : IMasterClient
    {
        private readonly HttpClient _httpClient;
        private readonly string folderPath = Path.GetFullPath("App_Data/");
        readonly GeneralFunctions GF = new();

        private readonly JsonSerializerOptions _deserializeOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="httpClient">HttpClient instance</param>
        public MasterClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("ApiKey", "D31950B5-743C-4A05-AF5D-62EA494C5C1B");
        }

        public async Task<APIResponse<List<CustomerListDto>>> CustomerList()
        {
            using var httpResponse = await _httpClient.GetAsync("/V1/Master/GetCustomerList");
            return JsonSerializer.Deserialize<APIResponse<List<CustomerListDto>>>(httpResponse.Content.ReadAsStringAsync().Result, _deserializeOptions);
        }

        public async Task<APIResponse<CreateCustomer>> CustomerDetails(string Id)
        {
            using var httpResponse = await _httpClient.GetAsync("/V1/Master/GetCustomerDetails/" + Id);
            return JsonSerializer.Deserialize<APIResponse<CreateCustomer>>(httpResponse.Content.ReadAsStringAsync().Result, _deserializeOptions);
        }
    }
}
