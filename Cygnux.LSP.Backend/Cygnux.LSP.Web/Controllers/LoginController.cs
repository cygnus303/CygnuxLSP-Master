using CygnuxLSP.Web.Models;
using CygnuxLSP.Web.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace CygnuxLSP.Web.Controllers
{
    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="authClient">AuthClient instance</param>
    public class LoginController(IAuthClient authClient, IMasterClient masterClient) : Controller
    {
        private readonly IAuthClient _authClient = authClient;
        private readonly IMasterClient _masterClient = masterClient;

        /// <summary>
        /// Login view action
        /// </summary>
        /// <param name="returnUrl">Return URL</param>
        /// <returns>View</returns>
        public IActionResult Index(string returnUrl = null)
        {
            this.ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        /// <summary>
        /// Login submission method
        /// </summary>
        /// <param name="loginViewModel">Login view model</param>
        /// <param name="returnUrl">Return URL</param>
        /// <returns>View</returns>
        public async Task<IActionResult> LoginUser(UserLogin loginModel, string returnUrl)
        {
            var result = await _authClient.Login(loginModel);
            if (result.StatusCode == HttpStatusCode.OK)
            {
                var claims = new List<Claim>()
                {
                    //new Claim("UserId", result.Data.UserID.ToString()),
                    new ("Email", result.Data.Email),
                    new ("Name", result.Data.Username),
                    //new Claim("MobileNo", result.Data.MobileNo),
                    //new Claim("UserIdentityID", result.Data.UserIdentityID),
                 };

                AuthenticationProperties options = new()
                {
                    AllowRefresh = true,
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddMinutes(60)
                };

                var claimIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var userPrincipal = new ClaimsPrincipal(claimIdentity);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                        userPrincipal, options /*new AuthenticationProperties() { IsPersistent = false, AllowRefresh = true, ExpiresUtc = DateTime.UtcNow.AddMinutes(5) }*/);

                if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                {
                    return LocalRedirect(returnUrl);
                }
            }

            if (result.Errors != null)
            {
                TempData["ErrorMessage"] = result.Errors.Message;
                return RedirectToAction("Index", "Login");
            }

            return RedirectToAction("Index", "Home");
        }

        /// <summary>
        /// Logout action
        /// </summary>
        /// <returns>Login view</returns>
        public async Task<IActionResult> Logout()
        {
            await Request.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            //return RedirectToAction("Index", "Login", new { returnUrl = "/" });
            return RedirectToAction("Index", "Login");
        }

        public IActionResult CreateUser()
        {
            return View();
        }
    }
}
