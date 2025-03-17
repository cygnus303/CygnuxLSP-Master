using System.Net;

namespace CygnuxLSP.Web.Response
{
    /// <summary>
    /// Types of status.
    /// </summary>
    public enum Status
    {
        /// <summary>
        /// Status Ok
        /// </summary>
        OK = 200,

        /// <summary>
        /// Status Ok
        /// </summary>
        CREATED = 200,

        /// <summary>
        /// Status Ok
        /// </summary>
        UPDATED = 200,

        /// <summary>
        /// Status Ok
        /// </summary>
        DELETED = 200,

        /// <summary>
        /// Status Ok
        /// </summary>
        BAD_REQUEST = 400,

        /// <summary>
        /// Status Ok
        /// </summary>
        UNAUTHORIZED = 401,

        /// <summary>
        /// Status Ok
        /// </summary>
        CONFLICT_EXCEPTION = 403,

        /// <summary>
        /// Status Ok
        /// </summary>
        EXCEPTION = 500,

        /// <summary>
        /// Status Ok
        /// </summary>
        WRONG_CREDENTIALS = 404,

        /// <summary>
        /// Status Ok
        /// </summary>
        ACCESS_DENIED = 503,

        /// <summary>
        /// Status Ok
        /// </summary>
        NOT_FOUND = 404,

        /// <summary>
        /// Status Ok
        /// </summary>
        DUPLICATE_ENTITY = 409
    }
    public class APIResponse<T>
    {
        /// <summary>
        /// Gets or sets status code
        /// </summary>
        public HttpStatusCode StatusCode { get; set; }

        /// <summary>
        /// Gets or sets status
        /// </summary>
        public Status Status { get; set; }

        /// <summary>
        /// Gets or sets data
        /// </summary>
        public T Data { get; set; }

        /// <summary>
        /// Gets or sets errors
        /// </summary>
        public ErrorDetails Errors { get; set; }

        /// <summary>
        /// Gets or sets meta data
        /// </summary>
        public object MetaData { get; set; }

        /// <summary>
        /// API response: OK
        /// </summary>
        /// <returns>API response object</returns>
        public static APIResponse<T> Ok()
        {
            APIResponse<T> apiResponse = new APIResponse<T>();
            apiResponse.Status = Status.OK;
            apiResponse.StatusCode = HttpStatusCode.OK;
            return apiResponse;
        }

        /// <summary>
        /// API response for duplicate entry
        /// </summary>
        /// <returns>API response object</returns>
        public static APIResponse<T> DuplicateEntity()
        {
            APIResponse<T> apiResponse = new APIResponse<T>();
            apiResponse.Status = Status.DUPLICATE_ENTITY;
            apiResponse.StatusCode = HttpStatusCode.Conflict;
            return apiResponse;
        }

        /// <summary>
        /// API response for error entry
        /// </summary>
        /// <returns>API response object</returns>
        public static APIResponse<T> Error()
        {
            APIResponse<T> apiResponse = new APIResponse<T>();
            apiResponse.Status = Status.BAD_REQUEST;
            apiResponse.StatusCode = HttpStatusCode.BadRequest;
            return apiResponse;
        }

        /// <summary>
        /// API response for wrong credentials
        /// </summary>
        /// <returns>API response object</returns>
        public static APIResponse<T> WrongCredentials()
        {
            APIResponse<T> apiResponse = new APIResponse<T>();
            apiResponse.Status = Status.WRONG_CREDENTIALS;
            apiResponse.StatusCode = HttpStatusCode.Unauthorized;
            return apiResponse;
        }

        /// <summary>
        /// Add error message to response
        /// </summary>
        /// <param name="errorMsg">Error message</param>
        public void AddErrorMsgToResponse(string errorMsg)
        {
            ErrorDetails error = new ErrorDetails();
            error.Message = errorMsg;
            error.TimeStamp = DateTime.Now;
            Errors = error;
        }

        /// <summary>
        /// Add error message to response
        /// </summary>
        /// <param name="errorMsg">Error message</param>
        /// <param name="ex">Exception</param>
        /// <param name="statusCode">Status code</param>
        public void AddErrorMsgToResponse(string errorMsg, Exception ex, int statusCode)
        {
            ErrorDetails error = new ErrorDetails();
            error.Message = errorMsg;
            error.TimeStamp = DateTime.Now;
            error.Errors = new List<string> { errorMsg };
            error.Status = statusCode;
            Errors = error;
        }

        /// <summary>
        /// Add array of errors to response
        /// </summary>
        /// <param name="errorMsg">Error message</param>
        /// <param name="errors">Array of errors</param>
        public void AddErrorsMsgToResponse(string errorMsg, Dictionary<string, List<string>> errors)
        {
            ErrorDetails error = new ErrorDetails();
            error.Message = errorMsg;
            error.TimeStamp = DateTime.Now;
            error.Errors = errors;
            error.Status = (int)Status.BAD_REQUEST;
            Errors = error;
        }

        /// <summary>
        /// Add error message to response
        /// </summary>
        /// <param name="errorMsg">Error message</param>
        /// <param name="errors">Errors list</param>
        /// <param name="statusCode">Status code</param>
        public void AddErrorsMsgToResponse(string errorMsg, List<string> errors, int statusCode)
        {
            ErrorDetails error = new ErrorDetails();
            error.Message = errorMsg;
            error.TimeStamp = DateTime.Now;
            error.Errors = new List<string> { errorMsg };
            error.Status = statusCode;
            Errors = error;
        }
    }
}
