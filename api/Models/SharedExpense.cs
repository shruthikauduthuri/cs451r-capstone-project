using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace api.Models
{
    [Table("shared_expenses")]
    public class SharedExpense : BaseModel
    {
        [PrimaryKey("id", false)]
        public string Id { get; set; } = string.Empty;

        [Column("household_id")]
        public string HouseholdId { get; set; } = string.Empty;

        [Column("created_by")]
        public string CreatedBy { get; set; } = string.Empty;

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("amount")]
        public decimal Amount { get; set; }

        [Column("split_type")]
        public string SplitType { get; set; } = "equal"; // "equal", "custom", "percentage"

        [Column("description")]
        public string? Description { get; set; }

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }
    }
}