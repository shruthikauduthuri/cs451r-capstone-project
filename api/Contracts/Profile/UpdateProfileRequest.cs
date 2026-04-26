using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Contracts.Profile
{
    public class UpdateProfileRequest
    {
        public string DisplayName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string HouseholdName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTimeOffset Updated_at { get; set; }
    }
}
