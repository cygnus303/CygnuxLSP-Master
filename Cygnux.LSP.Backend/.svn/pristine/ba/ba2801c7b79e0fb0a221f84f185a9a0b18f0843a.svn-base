using System.Text.Json;
using System.Text;

namespace CygnuxLSP.Web.Helper
{
    public class GenericHelper
    {
        /// <summary>
        /// GetStringContent method to call APIs
        /// </summary>
        /// <typeparam name="T">Class, ViewModel</typeparam>
        /// <param name="obj">Object</param>
        /// <returns>StringContent object for API call</returns>
        public static StringContent GetStringContent<T>(T obj) where T : class
        {
            return new StringContent(JsonSerializer.Serialize(obj), Encoding.UTF8, "application/json");
        }
    }
}
