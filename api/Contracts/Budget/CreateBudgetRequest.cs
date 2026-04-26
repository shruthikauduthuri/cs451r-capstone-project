using System;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Contracts.Budget
{
    public class CreateBudgetRequest
    {
            public string UserId { get; set; } = string.Empty;
    
            public string CategoryId { get; set; } = string.Empty;
    
            public decimal AmountLimit { get; set; }
    
            public int Month { get; set; }
    
            public int Year { get; set; }
    }
}