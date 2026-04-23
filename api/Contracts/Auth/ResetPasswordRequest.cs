using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Contracts.Auth
{
    public class ResetPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
    }
}