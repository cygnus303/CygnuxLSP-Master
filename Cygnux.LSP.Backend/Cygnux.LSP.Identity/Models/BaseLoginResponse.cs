namespace Cygnux.LSP.Identity.Models;

public class BaseLoginResponse<T>
{
    public bool IsSuccess { get; }
    public string? Message { get; }

    public T? Data { get; set; }

    public BaseLoginResponse(bool isSuccess, string message)
    {
        IsSuccess = isSuccess;
        Message = message;
    }

    public BaseLoginResponse(T data)
    {
        IsSuccess = true;
        Data = data;
    }
}
