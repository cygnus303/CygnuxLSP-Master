﻿namespace Cygnux.LSP.Application.Models.Request.Auth;

public class UserLoginRequest
{
    /// <summary>
    /// Gets or sets email
    /// </summary>

    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets password
    /// </summary>

    public string Password { get; set; } = string.Empty;
}