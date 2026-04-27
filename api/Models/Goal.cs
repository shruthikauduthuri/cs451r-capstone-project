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
    [Supabase.Postgrest.Attributes.Table("Savings_Goals")]
    public class Goal : BaseModel
    {
        [PrimaryKey("id", false)]
        public string Id { get; set; } = string.Empty;

        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("target_amount")]
        public decimal TargetAmount { get; set; }
        
        [Column("current_amount")]
        public decimal CurrentAmount { get; set; }

        [Column("deadline")]
        public DateTimeOffset Deadline { get; set; }

        [Column("created_at")]
        public DateTimeOffset Created_at { get; set; }
    }
}