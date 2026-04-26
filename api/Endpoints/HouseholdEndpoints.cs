using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api;
using api.Contracts.Household;
using api.Models;
using Supabase;
using Microsoft.Extensions.Logging;

namespace api.Endpoints
{
    public static class HouseholdEndpoints
    {
        public static void MapHouseholdEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/households", async (Client supabase, ILogger logger) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to create household");
                    return Results.Unauthorized();
                }

                if (string.IsNullOrWhiteSpace(user.Id))
                {
                    logger.LogWarning("Invalid user identity for household creation");
                    return Results.BadRequest("User ID is missing or invalid");
                }

                var joinCode = Guid.NewGuid().ToString().Substring(0, 6);
                logger.LogInformation("Creating household for user {UserId} with join code {JoinCode}", user.Id, joinCode);

                var response = await supabase.From<Household>().Insert(new Household
                {
                    AdminId = user.Id,
                    JoinCode = joinCode,
                    Created_at = DateTimeOffset.UtcNow
                });

                var createdHousehold = response.Models?.FirstOrDefault();
                if (createdHousehold == null)
                {
                    logger.LogError("Household insert returned no model for user {UserId}", user.Id);
                    return Results.StatusCode(500);
                }

                logger.LogInformation("Household created with ID {Id}", createdHousehold.Id);
                return Results.Ok(createdHousehold);
            });

            app.MapPost("/api/households/join", async (Client supabase, JoinHouseholdRequest request, ILogger logger) =>
            {
                if (request == null || string.IsNullOrWhiteSpace(request.JoinCode))
                {
                    logger.LogWarning("Invalid household join request");
                    return Results.BadRequest("JoinCode is required");
                }

                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to join household");
                    return Results.Unauthorized();
                }

                if (string.IsNullOrWhiteSpace(user.Id) || !long.TryParse(user.Id, out var userProfileId))
                {
                    logger.LogWarning("Invalid authenticated user ID while joining household");
                    return Results.BadRequest("Invalid user ID");
                }

                logger.LogInformation("User {UserId} attempting to join household with code {JoinCode}", user.Id, request.JoinCode);

                // Lookup household by join code
                var householdResponse = await supabase.From<Household>()
                    .Where(h => h.JoinCode == request.JoinCode)
                    .Get();

                var household = householdResponse.Models?.FirstOrDefault();
                if (household == null)
                {
                    logger.LogWarning("Household with join code {JoinCode} not found", request.JoinCode);
                    return Results.NotFound("Household not found");
                }

                var householdId = household.Id;

                // Check if user is already a member
                var existingProfile = await supabase.From<Profile>()
                    .Where(p => p.Id == userProfileId)
                    .Get();

                var profile = existingProfile.Models?.FirstOrDefault();
                if (profile == null)
                {
                    logger.LogWarning("Authenticated user profile not found for user {UserId}", user.Id);
                    return Results.NotFound("User profile not found");
                }

                if (profile.HouseholdId != null)
                {
                    logger.LogWarning("User {UserId} is already a member of household {HouseholdId}", user.Id, profile.HouseholdId);
                    return Results.BadRequest("User is already a member of a household");
                }

                // Add user to household
                await supabase.From<Profile>()
                    .Where(p => p.Id == userProfileId)
                    .Set(p => p.HouseholdId!, householdId)
                    .Set(p => p.Role, "partner")
                    .Update();

                logger.LogInformation("User {UserId} successfully joined household {HouseholdId}", user.Id, household.Id);
                return Results.Ok(new { household.Id, household.JoinCode });
            });

            app.MapGet("/api/households/{id}/members", async (Client supabase, long id, ILogger logger) =>
            {
                logger.LogInformation("Retrieving members for household {HouseholdId}", id);

                var membersResponse = await supabase.From<Profile>()
                    .Where(p => p.HouseholdId == id)
                    .Get();

                var members = membersResponse.Models ?? new List<Profile>();
                logger.LogInformation("Retrieved {Count} members for household {HouseholdId}", members.Count, id);
                return Results.Ok(members);
            });

            app.MapPut("/api/households/{id}", async (Client supabase, long id, HouseholdUpdateRequest request, ILogger logger) =>
            {
                if (request == null)
                {
                    logger.LogWarning("Invalid household update request for household {HouseholdId}", id);
                    return Results.BadRequest("Request body is required");
                }

                var currentUser = supabase.Auth.CurrentUser;
                if (currentUser == null)
                {
                    logger.LogWarning("Unauthorized attempt to update household {HouseholdId}", id);
                    return Results.Unauthorized();
                }

                if (string.IsNullOrWhiteSpace(currentUser.Id))
                {
                    logger.LogWarning("Invalid authenticated user ID while updating household {HouseholdId}", id);
                    return Results.BadRequest("Invalid user ID");
                }

                logger.LogInformation("Updating household {HouseholdId}", id);

                // Check if current user is admin of the household
                var householdResponse = await supabase.From<Household>()
                    .Where(h => h.Id == id && h.AdminId == currentUser.Id)
                    .Get();

                if (householdResponse.Models?.Any() != true)
                {
                    logger.LogWarning("User {UserId} is not admin of household {HouseholdId}", currentUser.Id, id);
                    return Results.Forbid();
                }

                // Update household
                var query = supabase.From<Household>()
                    .Where(h => h.Id == id);

                if (!string.IsNullOrEmpty(request.JoinCode))
                {
                    query = query.Set(h => h.JoinCode, request.JoinCode);
                }
                else
                {
                    logger.LogWarning("No household update data provided for household {HouseholdId}", id);
                    return Results.BadRequest("No changes provided");
                }

                await query.Update();

                logger.LogInformation("Household {HouseholdId} updated", id);
                return Results.Ok();
            });

            app.MapPut("/api/households/{id}/members/{userId}", async (Client supabase, long id, string userId, ILogger logger) =>
            {
                if (string.IsNullOrWhiteSpace(userId))
                {
                    logger.LogWarning("Invalid userId path parameter for household {HouseholdId}", id);
                    return Results.BadRequest("UserId is required");
                }

                if (!long.TryParse(userId, out var targetUserId))
                {
                    logger.LogWarning("Invalid userId value {UserId} for household {HouseholdId}", userId, id);
                    return Results.BadRequest("UserId must be a numeric value");
                }

                var currentUser = supabase.Auth.CurrentUser;
                if (currentUser == null)
                {
                    logger.LogWarning("Unauthorized attempt to add member to household {HouseholdId}", id);
                    return Results.Unauthorized();
                }

                logger.LogInformation("Adding member {UserId} to household {HouseholdId}", userId, id);

                // Check if current user is admin of the household
                var householdResponse = await supabase.From<Household>()
                    .Where(h => h.Id == id && h.AdminId == currentUser.Id)
                    .Get();

                if (householdResponse.Models?.Any() != true)
                {
                    logger.LogWarning("User {UserId} is not admin of household {HouseholdId}", currentUser.Id, id);
                    return Results.Forbid();
                }

                // Add user to household
                await supabase.From<Profile>()
                    .Where(p => p.Id == targetUserId)
                    .Set(p => p.HouseholdId!, id)
                    .Set(p => p.Role, "member")
                    .Update();

                logger.LogInformation("Member {UserId} added to household {HouseholdId}", userId, id);
                return Results.Ok();
            });

            app.MapDelete("/api/households/{id}/members/{userId}", async (Client supabase, long id, string userId, ILogger logger) =>
            {
                if (string.IsNullOrWhiteSpace(userId))
                {
                    logger.LogWarning("Invalid userId path parameter for household {HouseholdId}", id);
                    return Results.BadRequest("UserId is required");
                }

                if (!long.TryParse(userId, out var targetUserId))
                {
                    logger.LogWarning("Invalid userId value {UserId} for household {HouseholdId}", userId, id);
                    return Results.BadRequest("UserId must be a numeric value");
                }

                var currentUser = supabase.Auth.CurrentUser;
                if (currentUser == null)
                {
                    logger.LogWarning("Unauthorized attempt to remove member from household {HouseholdId}", id);
                    return Results.Unauthorized();
                }

                logger.LogInformation("Removing member {UserId} from household {HouseholdId}", userId, id);

                // Check if current user is admin of the household
                var householdResponse = await supabase.From<Household>()
                    .Where(h => h.Id == id && h.AdminId == currentUser.Id)
                    .Get();

                if (householdResponse.Models?.Any() != true)
                {
                    logger.LogWarning("User {UserId} is not admin of household {HouseholdId}", currentUser.Id, id);
                    return Results.Forbid();
                }

                // Remove user from household
                var memberProfileResponse = await supabase.From<Profile>()
                    .Where(p => p.Id == targetUserId)
                    .Get();

                if (memberProfileResponse.Models?.Any() != true)
                {
                    logger.LogWarning("Target profile not found for user {UserId}", userId);
                    return Results.NotFound("Target user profile not found");
                }

                await supabase.From<Profile>()
                    .Where(p => p.Id == targetUserId)
                    .Set(p => p.HouseholdId!, null)
                    .Set(p => p.Role, string.Empty)
                    .Update();

                logger.LogInformation("Member {UserId} removed from household {HouseholdId}", userId, id);
                return Results.NoContent();
            });
        }
    }
}