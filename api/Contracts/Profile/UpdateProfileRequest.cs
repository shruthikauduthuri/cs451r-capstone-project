using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Contracts.Profile
{
    public class UpdateProfileRequest
    {
        public string DisplayName { get; set; } = string.Empty;
    }
}
