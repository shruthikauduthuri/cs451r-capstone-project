using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Contracts.User
{
    public class UpdateUserRequest
    {
        public string DisplayName { get; set; } = string.Empty;
    }
}