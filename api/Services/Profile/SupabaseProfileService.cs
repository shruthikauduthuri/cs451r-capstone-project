using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Services.Profile;
using api.Models;
using Supabase;

namespace api.Services.Profile
{
    public class SupabaseProfileService : IProfileService
    {
        private readonly Client _client;

        public SupabaseProfileService(Client client)
        {
            _client = client;
        }

        public async Task CreateProfile(Models.Profile profile)
        {
            await _client.From<Models.Profile>().Insert(profile);
        }
    }
}