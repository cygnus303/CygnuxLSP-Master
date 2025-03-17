using System.Text.Json;

namespace CygnuxLSP.Web.Response
{
    public class ErrorDetails
    {
        /// <summary>
        /// Gets or sets status
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// Gets or sets message
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Gets or sets errors
        /// </summary>
        public object Errors { get; set; }

        /// <summary>
        /// Gets or sets timestamp
        /// </summary>
        public DateTime TimeStamp { get; set; }

        /// <summary>
        /// ToString() override method
        /// </summary>
        /// <returns>Json string</returns>
        public override string ToString()
        {
            return JsonSerializer.Serialize(this);
        }
    }
}
