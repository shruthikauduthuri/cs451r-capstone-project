using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Contracts
{
    public class CreateProfileRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string HouseholdName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTimeOffset Created_at { get; set; }
    }
}