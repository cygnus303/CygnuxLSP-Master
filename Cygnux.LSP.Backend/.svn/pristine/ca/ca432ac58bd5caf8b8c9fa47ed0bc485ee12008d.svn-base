using CygnuxLSP.Web.Classes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace CygnuxLSP.Web.Controllers
{
    public class BaseController : Controller
    {
        private string _BaseUserId = string.Empty;
        private string _BaseUserName = string.Empty;
        private string _BaseEmail = string.Empty;
        private string _BaseMobileNo = string.Empty;
        private string _BaseUserIdentityID = string.Empty;

        public string BaseUserId { get { return _BaseUserId; } }
        public string BaseUserName { get { return _BaseUserName; } }
        public string BaseEmail { get { return _BaseEmail; } }
        public string BaseMobileNo { get { return _BaseMobileNo; } }
        public string BaseUserIdentityID { get { return _BaseUserIdentityID; } }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            try
            {
                var userId = HttpContext.User.Claims;
                var identity = (ClaimsIdentity)User.Identity;
                IEnumerable<Claim> claims = identity.Claims;
                if (User.Identity.IsAuthenticated == true)
                {
                    ViewBag.BaseUserId = _BaseUserId = User.Identity.GetClaims(ClaimIdentityKey.UserId).ToUpper();
                    ViewBag.BaseUserName = _BaseUserName = User.Identity.GetClaims(ClaimIdentityKey.Name).ToUpper();
                    ViewBag.BaseEmail = _BaseEmail = User.Identity.GetClaims(ClaimIdentityKey.Email);
                    ViewBag.BaseMobileNo = _BaseMobileNo = User.Identity.GetClaims(ClaimIdentityKey.MobileNo);
                    ViewBag.BaseUserIdentityID = _BaseUserIdentityID = User.Identity.GetClaims(ClaimIdentityKey.UserIdentityID);
                    ViewBag.DefaultDateFormat = "{0:dd/MM/yyyy}";
                    ViewBag.DefaultJqueryDateFormat = "dd/MM/yyyy";
                    ViewBag.DefaultDateTimeFormat = "{0:dd/MM/yyyy hh:mm tt}";
                    ViewBag.TableBoxColor = "green";
                    var fromLogin = TempData["login"] as string;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public override Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            Prepare();
            return base.OnActionExecutionAsync(context, next);
        }

        public virtual void Prepare()
        {
        }
    }
}
