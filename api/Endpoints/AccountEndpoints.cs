using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Contracts;
using api.Models;
using Supabase;
using Microsoft.Extensions.Logging;
using api.Contracts.Account;

namespace api.Endpoints
{
    public static class AccountEndpoints
    {
        public static void MapAccountEndpoints(this WebApplication app)
        {
            app.MapGet("/api/accounts", async (Client supabase, ILogger<Program> logger) =>
            {
                logger.LogInformation("Retrieving all accounts for current user");
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to retrieve accounts");
                    return Results.Unauthorized();
                }

                var accountsResponse = await supabase.From<Account>()
                    .Where(a => a.UserId == user.Id)
                    .Get();

                logger.LogInformation("Retrieved {AccountCount} accounts for user {UserId}", accountsResponse.Models?.Count ?? 0, user.Id);
                return Results.Ok(accountsResponse.Models ?? new List<Account>());
            });

            app.MapPost("/api/accounts", async (Client supabase, CreateAccountRequest request, ILogger<Program> logger) =>
            {
                logger.LogInformation("Creating new account");
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to create account");
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

                logger.LogInformation("Account created for user {UserId}", user.Id);
                return Results.Created($"/api/accounts/{newAccount.Id}", newAccount);
            });

            app.MapGet("/api/accounts/{id}", async (long id, Client supabase, ILogger<Program> logger) =>
            {
                logger.LogInformation("Retrieving account {AccountId}", id);
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to retrieve account {AccountId}", id);
                    return Results.Unauthorized();
                }

                var accountResponse = await supabase.From<Account>()
                    .Where(a => a.Id == id && a.UserId == user.Id)
                    .Get();

                var account = accountResponse.Models?.FirstOrDefault();
                if (account == null)
                {
                    logger.LogWarning("Account {AccountId} not found for user {UserId}", id, user.Id);
                    return Results.NotFound("Account not found");
                }

                logger.LogInformation("Retrieved account {AccountId} for user {UserId}", id, user.Id);
                return Results.Ok(account);
            });

            app.MapPut("/api/accounts/{id}", async (long id, Client supabase, UpdateAccountRequest request, ILogger<Program> logger) =>
            {
                logger.LogInformation("Updating account {AccountId}", id);
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to update account {AccountId}", id);
                    return Results.Unauthorized();
                }

                var accountResponse = await supabase.From<Account>()
                    .Where(a => a.Id == id && a.UserId == user.Id)
                    .Get();

                var account = accountResponse.Models?.FirstOrDefault();
                if (account == null)
                {
                    logger.LogWarning("Account {AccountId} not found for user {UserId}", id, user.Id);
                    return Results.NotFound("Account not found");
                }

                await supabase.From<Account>()
                    .Where(a => a.Id == id)
                    .Set(a => a.Name, request.Name)
                    .Set(a => a.Type, request.Type)
                    .Set(a => a.Balance, request.Balance)
                    .Update();

                logger.LogInformation("Account {AccountId} updated for user {UserId}", id, user.Id);
                return Results.Ok();
            });

            app.MapDelete("/api/accounts/{id}", async (long id, Client supabase, ILogger<Program> logger) =>
            {
                logger.LogInformation("Deleting account {AccountId}", id);
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to delete account {AccountId}", id);
                    return Results.Unauthorized();
                }

                var accountResponse = await supabase.From<Account>()
                    .Where(a => a.Id == id && a.UserId == user.Id)
                    .Get();

                var account = accountResponse.Models?.FirstOrDefault();
                if (account == null)
                {
                    logger.LogWarning("Account {AccountId} not found for user {UserId}", id, user.Id);
                    return Results.NotFound("Account not found");
                }

                await supabase.From<Account>()
                    .Where(a => a.Id == id)
                    .Delete();

                logger.LogInformation("Account {AccountId} deleted for user {UserId}", id, user.Id);
                return Results.Ok();
            });

            app.MapPost("/api/accounts/transition", async (Client supabase, ILogger<Program> logger) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to transition account");
                    return Results.Unauthorized();
                }

                if (string.IsNullOrWhiteSpace(user.Id) || !long.TryParse(user.Id, out var userProfileId))
                {
                    logger.LogWarning("Invalid authenticated user ID while transitioning account");
                    return Results.BadRequest("Invalid user ID");
                }

                logger.LogInformation("Transitioning account {UserId}", user.Id);

                // Get current profile
                var profileResponse = await supabase.From<Profile>()
                    .Where(p => p.Id == userProfileId)
                    .Get();

                var profile = profileResponse.Models?.FirstOrDefault();
                if (profile == null)
                {
                    logger.LogWarning("Account profile not found for account {AccountId}", user.Id);
                    return Results.NotFound("Account profile not found");
                }

                // If account is not in a household, nothing to transition
                if (profile.HouseholdId == null)
                {
                    logger.LogInformation("Account {AccountId} is not in a household, no transition needed", user.Id);
                    return Results.Ok("Account is already individual");
                }

                // Remove account from household
                await supabase.From<Profile>()
                    .Where(p => p.Id == userProfileId)
                    .Set(p => p.HouseholdId!, null)
                    .Set(p => p.Role, "")
                    .Update();

                logger.LogInformation("Account {AccountId} successfully transitioned out of household {HouseholdId}", user.Id, profile.HouseholdId);
                return Results.Ok("Account transitioned");
            });
        }
    }
}
