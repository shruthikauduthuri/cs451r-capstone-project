using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Contracts
{
    public class CreateTransactionResponse
    {
        public long Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string AccountId { get; set; } = string.Empty;
        public string CategoryId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTimeOffset Created_at { get; set; }
    }
}