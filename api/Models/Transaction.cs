using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using ColumnAttribute = Supabase.Postgrest.Attributes.ColumnAttribute;

namespace api.Models
{
    [Supabase.Postgrest.Attributes.Table("Transactions")]
    public class Transaction : BaseModel
    {
        public int Id { get; set; }
        public string Category { get; set; } = string.Empty;
        
    }
}