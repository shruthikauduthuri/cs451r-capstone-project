using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Contracts.PrivacyRules
{
    public class CreatePrivacyRuleRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string RuleType { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
}