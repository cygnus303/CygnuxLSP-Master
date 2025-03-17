using CygnuxLSP.Web.Models.Master.Customer;
using CygnuxLSP.Web.Response;

namespace CygnuxLSP.Web.Services.Interfaces
{
    public interface IMasterClient
    {
        Task<APIResponse<List<CustomerListDto>>> CustomerList();

        Task<APIResponse<CreateCustomer>> CustomerDetails(string Id);
    }
}
