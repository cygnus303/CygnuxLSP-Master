using CygnuxLSP.Web.Models.Master.Customer;
using CygnuxLSP.Web.Services.Implementation;
using CygnuxLSP.Web.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CygnuxLSP.Web.Controllers
{
    [Authorize]
    public class MasterController(ILogger<MasterController> logger, IMasterClient masterClient) : BaseController
    {
        private readonly ILogger<MasterController> _logger = logger;
        private readonly IMasterClient _masterClient = masterClient;

        #region Customer
        public async Task<ActionResult> Customer()
        {
            await Task.Delay(100);
            return View();
        }
        public async Task<ActionResult> AddEditCustomer(string id)
        {
            CreateCustomer createCustomer = new CreateCustomer();
            if (!string.IsNullOrEmpty(id) && id != "0")
            {
                createCustomer = (await _masterClient.CustomerDetails(id)).Data;
                createCustomer.UpdateBy = !string.IsNullOrEmpty(BaseUserName) ? BaseUserName.ToLower() : BaseUserName;
            }
            else
            {
                createCustomer.EntryBy = !string.IsNullOrEmpty(BaseUserName) ? BaseUserName.ToLower() : BaseUserName;
            }
            return PartialView("_AddEditCustomer", createCustomer);
        }

        [HttpGet]
        public async Task<JsonResult> GetCustomerListJson()
        {
            var Customer = await _masterClient.CustomerList();

            var ListVehiclesdata = (from e in Customer.Data
                                    select new
                                    {
                                        e.TenantId,
                                        e.CustomerCode,
                                        e.CustomerName
                                    }).ToArray();

            var jsonResult = Json(ListVehiclesdata, new Newtonsoft.Json.JsonSerializerSettings());
            return jsonResult;
        }
        #endregion
    }
}
