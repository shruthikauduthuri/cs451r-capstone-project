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
    [Supabase.Postgrest.Attributes.Table("Budgets")]
    public class Budget : BaseModel
    {
        // This is the budget id, not the user id or profile id
        [PrimaryKey("id", false)]
        public string Id { get; set; } = string.Empty;

        // This is the user id of the user who created the budget, not the profile id
        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;

        // Name maybe?

        [Column("category_id")]
        public string CategoryId { get; set; } = string.Empty;

        [Column("amount_limit")]
        public decimal AmountLimit { get; set; }

        [Column("month")]
        public int Month { get; set; }

        [Column("year")]
        public int Year { get; set; }

        [Column("created_at")]
        public DateTimeOffset Created_at { get; set; }
    }
}