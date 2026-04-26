using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api;
using api.Contracts.User;
using api.Models;
using Supabase;
using Microsoft.Extensions.Logging;

namespace api.Endpoints
{
    public static class UserEndpoints
    {
        public static void MapUserEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/api/users/me", async (Client supabase, ILogger logger) =>
            {
                logger.LogInformation("Retrieving current user information");
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to retrieve user information");
                    return Results.Unauthorized();
                }

                logger.LogInformation("User information retrieved for {UserId}", user.Id);
                return Results.Ok(user);
            });

            app.MapPut("/api/users/me", async (Client supabase, UpdateUserRequest request, ILogger logger) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to update user information");
                    return Results.Unauthorized();
                }

                logger.LogInformation("Updating user information for {UserId}", user.Id);
                // Example update (extend to your DB model)
                await supabase.From<User>()
                    .Where(u => u.Id == user.Id)
                    .Set(u => u.Name, request.DisplayName)
                    .Update();

                logger.LogInformation("User information updated for {UserId}", user.Id);
                return Results.Ok();
            });

            app.MapPost("/api/users/transition", async (Client supabase, ILogger logger) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to transition user");
                    return Results.Unauthorized();
                }

                if (string.IsNullOrWhiteSpace(user.Id) || !long.TryParse(user.Id, out var userProfileId))
                {
                    logger.LogWarning("Invalid authenticated user ID while transitioning user");
                    return Results.BadRequest("Invalid user ID");
                }

                logger.LogInformation("Transitioning user {UserId}", user.Id);

                // Get current profile
                var profileResponse = await supabase.From<Profile>()
                    .Where(p => p.Id == userProfileId)
                    .Get();

                var profile = profileResponse.Models?.FirstOrDefault();
                if (profile == null)
                {
                    logger.LogWarning("User profile not found for user {UserId}", user.Id);
                    return Results.NotFound("User profile not found");
                }

                // If user is not in a household, nothing to transition
                if (profile.HouseholdId == null)
                {
                    logger.LogInformation("User {UserId} is not in a household, no transition needed", user.Id);
                    return Results.Ok("User is already individual");
                }

                // Remove user from household
                await supabase.From<Profile>()
                    .Where(p => p.Id == userProfileId)
                    .Set(p => p.HouseholdId, null)
                    .Set(p => p.Role, "")
                    .Update();

                logger.LogInformation("User {UserId} successfully transitioned out of household {HouseholdId}", user.Id, profile.HouseholdId);
                return Results.Ok("Account transitioned");
            });
        }
    }
}