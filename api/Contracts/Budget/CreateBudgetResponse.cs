using System;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Contracts.Budget
{
    public class CreateBudgetResponse
    {
        public long Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string CategoryId { get; set; } = string.Empty;
        public decimal AmountLimit { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public DateTimeOffset Created_at { get; set; }
    }
}