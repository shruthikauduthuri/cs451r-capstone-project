using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using ColumnAttribute = Supabase.Postgrest.Attributes.ColumnAttribute;

namespace api.Models
{
    [Supabase.Postgrest.Attributes.Table("SharedExpenses")]
    public class SharedExpense : BaseModel
    {
        [PrimaryKey("id", false)]
        public long Id { get; set; }

        public long Household_id { get; set; }
        public long Created_by { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Split_type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTimeOffset Created_at { get; set; }
    }
}