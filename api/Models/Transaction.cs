using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public string Category { get; set; } = string.Empty;
        
    }
}