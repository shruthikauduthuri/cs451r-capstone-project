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

        // Add other properties as needed
    }
}