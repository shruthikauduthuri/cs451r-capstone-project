using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Contracts;
using api.Models;
using Supabase;
using api.Contracts.Account;

namespace api.Endpoints
{
    public static class AccountEndpoints
    {
        public static void MapAccountEndpoints(this WebApplication app)
        {
            app.MapGet("/api/accounts", async (Client supabase) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    return Results.Unauthorized();
                }

                var accountsResponse = await supabase.From<Account>()
                    .Where(a => a.UserId == user.Id)
                    .Get();

                return Results.Ok(accountsResponse.Models ?? new List<Account>());
            });

            app.MapPost("/api/accounts", async (Client supabase, CreateAccountRequest request) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    return Results.Unauthorized();
                }

                var newAccount = new Account
                {
                    UserId = user.Id!,
                    Name = request.Name,
                    Type = request.Type,
                    Balance = request.Balance,
                    Created_at = DateTimeOffset.UtcNow
                };

                var response = await supabase.From<Account>()
                    .Insert(newAccount);

                return Results.Created($"/api/accounts/{newAccount.Id}", newAccount);
            });

            app.MapGet("/api/accounts/{id}", async (string id, Client supabase) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    return Results.Unauthorized();
                }

                var accountResponse = await supabase.From<Account>()
                    .Where(a => a.Id == id && a.UserId == user.Id)
                    .Get();

                var account = accountResponse.Models?.FirstOrDefault();
                if (account == null)
                {
                    return Results.NotFound("Account not found");
                }

                return Results.Ok(account);
            });

            app.MapPut("/api/accounts/{id}", async (string id, Client supabase, UpdateAccountRequest request) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    return Results.Unauthorized();
                }

                var accountResponse = await supabase.From<Account>()
                    .Where(a => a.Id == id && a.UserId == user.Id)
                    .Get();

                var account = accountResponse.Models?.FirstOrDefault();
                if (account == null)
                {
                    return Results.NotFound("Account not found");
                }

                await supabase.From<Account>()
                    .Where(a => a.Id == request.Id)
                    .Set(a => a.Name, request.Name)
                    .Set(a => a.Type, request.Type)
                    .Set(a => a.Balance, request.Balance)
                    .Update();

                return Results.Ok();
            });

            app.MapDelete("/api/accounts/{id}", async (string id, Client supabase) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    return Results.Unauthorized();
                }

                var accountResponse = await supabase.From<Account>()
                    .Where(a => a.Id == id && a.UserId == user.Id)
                    .Get();

                var account = accountResponse.Models?.FirstOrDefault();
                if (account == null)
                {
                    return Results.NotFound("Account not found");
                }

                await supabase.From<Account>()
                    .Where(a => a.Id == id)
                    .Delete();

                return Results.Ok();
            });

            app.MapPost("/api/accounts/transition", async (Client supabase) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    return Results.Unauthorized();
                }

                if (string.IsNullOrWhiteSpace(user.Id))
                {
                    return Results.BadRequest("Invalid user ID");
                }


                // Get current profile
                var profileResponse = await supabase.From<Profile>()
                    .Where(p => p.Id == user.Id)
                    .Get();

                var profile = profileResponse.Models?.FirstOrDefault();
                if (profile == null)
                {
                    return Results.NotFound("Account profile not found");
                }

                // If account is not in a household, nothing to transition
                if (profile.HouseholdId == null)
                {
                    return Results.Ok("Account is already individual");
                }

                // Remove account from household
                await supabase.From<Profile>()
                    .Where(p => p.Id == user.Id)
                    .Set(p => p.HouseholdId!, null)
                    .Set(p => p.Role, "")
                    .Update();

                return Results.Ok("Account transitioned");
            });
        }
    }
}
