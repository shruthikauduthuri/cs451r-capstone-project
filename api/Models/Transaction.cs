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
    [Supabase.Postgrest.Attributes.Table("Transactions")]
    public class Transaction : BaseModel
    {
        [PrimaryKey("id", false)]
        public string Id { get; set; } = string.Empty;

        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;

        [Column("household_id")]
        public string HouseholdId { get; set; } = string.Empty;

        [Column("account_id")]
        public string AccountId { get; set; } = string.Empty;

        [Column("category_id")]
        public string CategoryId { get; set; } = string.Empty;

        [Column("amount")]
        public decimal Amount { get; set; }

        [Column("type")]
        public string Type { get; set; } = string.Empty; // "income" or "expense"

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Column("transaction_date")]
        public DateOnly TransactionDate { get; set; }

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }
    }
}