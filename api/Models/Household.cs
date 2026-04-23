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
    [Supabase.Postgrest.Attributes.Table("Households")]
    public class Household : BaseModel
    {
        [PrimaryKey("id", false)]
        public long Id { get; set; }

        [Column("admin_id")]
        public string AdminId { get; set; } = string.Empty;

        [Column("join_code")]
        public string JoinCode { get; set; } = string.Empty;
    }
}