using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace api.Models
{
    [Table("households")]
    public class Household : BaseModel
    {
        [PrimaryKey("id", false)]
        public string Id { get; set; } = string.Empty;

        [Column("admin_id")]
        public string AdminId { get; set; } = string.Empty;

        [Column("join_code")]
        public string JoinCode { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }
    }
}