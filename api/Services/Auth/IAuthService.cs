using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Services.Auth
{
    public interface IAuthService
    {
        Task<(string? UserId, string? Email, string? Token)> SignUp(string email, string password);
        Task<(string? UserId, string? Email, string? Token)> SignIn(string email, string password);
        Task SignOut();
        Task ResetPassword(string email);
        (string? UserId, string? Email)? GetSession();
    }
}