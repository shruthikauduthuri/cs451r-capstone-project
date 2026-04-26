using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace api.Models
{
    [Table("privacy_rules")]
    public class PrivacyRule : BaseModel
    {
        [PrimaryKey("id", false)]
        public string Id { get; set; } = string.Empty;

        [Column("household_id")]
        public string HouseholdId { get; set; } = string.Empty;

        [Column("role")]
        public string Role { get; set; } = string.Empty; // admin, parent, partner, roommate, child

        [Column("resource_type")]
        public string ResourceType { get; set; } = string.Empty; // budgets, transactions, goals, etc.

        [Column("can_view")]
        public bool CanView { get; set; }

        [Column("can_edit")]
        public bool CanEdit { get; set; }

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }
    }
}