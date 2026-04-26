using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using ColumnAttribute = Supabase.Postgrest.Attributes.ColumnAttribute;

namespace api.Models
{
    [Supabase.Postgrest.Attributes.Table("Profiles")]
    public class Profile : BaseModel
    {
        [PrimaryKey("id", false)]
        public long Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("household_id")]
        public long? HouseholdId { get; set; }

        [Column("role")]
        public string Role { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTimeOffset Created_at { get; set; }
    }
}