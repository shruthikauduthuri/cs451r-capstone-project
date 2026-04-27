using System;
using System.Linq;
using System.Threading.Tasks;
using api.Contracts.Profile;
using api.Models;
using Supabase;
using Microsoft.Extensions.Logging;

namespace api.Endpoints
{
    public static class ProfileEndpoints
    {
        public static void MapProfileEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/api/profile/me", async (Client supabase, ILogger<Program> logger) =>
            {
                logger.LogInformation("Retrieving current profile information");
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to retrieve profile information");
                    return Results.Unauthorized();
                }

                if (string.IsNullOrWhiteSpace(user.Id) || !long.TryParse(user.Id, out var userProfileId))
                {
                    logger.LogWarning("Invalid authenticated user ID while retrieving profile");
                    return Results.BadRequest("Invalid user ID");
                }

                var profileResponse = await supabase.From<Profile>()
                    .Where(p => p.Id == userProfileId)
                    .Get();

                var profile = profileResponse.Models?.FirstOrDefault();
                if (profile == null)
                {
                    logger.LogWarning("Profile not found for user {UserId}", user.Id);
                    return Results.NotFound("Profile not found");
                }

                logger.LogInformation("Profile information retrieved for {UserId}", user.Id);
                return Results.Ok(profile);
            });

            app.MapPut("/api/profile/me", async (Client supabase, UpdateProfileRequest request, ILogger<Program> logger) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to update profile information");
                    return Results.Unauthorized();
                }

                if (string.IsNullOrWhiteSpace(user.Id) || !long.TryParse(user.Id, out var userProfileId))
                {
                    logger.LogWarning("Invalid authenticated user ID while updating profile");
                    return Results.BadRequest("Invalid user ID");
                }

                logger.LogInformation("Updating profile information for {UserId}", user.Id);
                await supabase.From<Profile>()
                    .Where(p => p.Id == userProfileId)
                    .Set(p => p.Name, request.DisplayName)
                    .Update();

                logger.LogInformation("Profile information updated for {UserId}", user.Id);
                return Results.Ok();
            });

            app.MapPost("/api/profile/transition", async (Client supabase, ILogger<Program> logger) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to transition profile");
                    return Results.Unauthorized();
                }

                if (string.IsNullOrWhiteSpace(user.Id) || !long.TryParse(user.Id, out var userProfileId))
                {
                    logger.LogWarning("Invalid authenticated user ID while transitioning profile");
                    return Results.BadRequest("Invalid user ID");
                }

                logger.LogInformation("Transitioning profile {UserId}", user.Id);

                var profileResponse = await supabase.From<Profile>()
                    .Where(p => p.Id == userProfileId)
                    .Get();

                var profile = profileResponse.Models?.FirstOrDefault();
                if (profile == null)
                {
                    logger.LogWarning("Profile not found for user {UserId}", user.Id);
                    return Results.NotFound("Profile not found");
                }

                if (profile.HouseholdId == null)
                {
                    logger.LogInformation("Profile {UserId} is not in a household, no transition needed", user.Id);
                    return Results.Ok("Profile is already individual");
                }

                await supabase.From<Profile>()
                    .Where(p => p.Id == userProfileId)
                    .Set(p => p.HouseholdId!, null)
                    .Set(p => p.Role, string.Empty)
                    .Update();

                logger.LogInformation("Profile {UserId} successfully transitioned out of household {HouseholdId}", user.Id, profile!.HouseholdId);
                return Results.Ok("Account transitioned");
            });
        }
    }
}
