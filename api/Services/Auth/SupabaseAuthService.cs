using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Services.Auth;
using Supabase;

namespace api.Services.Auth
{
    public class SupabaseAuthService : IAuthService
    {
        private readonly Client _client;

        public SupabaseAuthService(Client client)
        {
            _client = client;
        }

        public async Task<(string?, string?, string?)> SignUp(string email, string password)
        {
            var auth = await _client.Auth.SignUp(email, password);

            if (auth?.User == null)
                return (null, null, null);

            return (auth.User.Id, auth.User.Email, auth.AccessToken);
        }

        public async Task<(string?, string?, string?)> SignIn(string email, string password)
        {
            var auth = await _client.Auth.SignIn(email, password);

            if (auth?.User == null)
                return (null, null, null);

            return (auth.User.Id, auth.User.Email, auth.AccessToken);
        }

        public Task SignOut() => _client.Auth.SignOut();

        public Task ResetPassword(string email) =>
            _client.Auth.ResetPasswordForEmail(email);

        public (string?, string?)? GetSession()
        {
            var session = _client.Auth.CurrentSession;

            if (session?.User == null)
                return null;

            return (session.User.Id, session.User.Email);
        }
    }
}