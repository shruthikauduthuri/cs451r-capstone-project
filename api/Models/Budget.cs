using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace api.Models
{
    [Table("budgets")]
    public class Budget : BaseModel
    {
        [PrimaryKey("id", false)]
        public string Id { get; set; } = string.Empty;

        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;

        [Column("household_id")]
        public string? HouseholdId { get; set; }

        [Column("category_id")]
        public string? CategoryId { get; set; }

        [Column("amount_limit")]
        public decimal AmountLimit { get; set; }

        [Column("month")]
        public int Month { get; set; }

        [Column("year")]
        public int Year { get; set; }

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }
    }
}