using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace api.Models
{
    [Table("goals")]
    public class Goal : BaseModel
    {
        [PrimaryKey("id", false)]
        public string Id { get; set; } = string.Empty;

        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;

        [Column("household_id")]
        public string? HouseholdId { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("target_amount")]
        public decimal TargetAmount { get; set; }

        [Column("current_amount")]
        public decimal CurrentAmount { get; set; }

        [Column("deadline")]
        public DateTimeOffset? Deadline { get; set; }

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }
    }
}