using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api;
using api.Contracts;
using api.Models;
using Supabase;
using Microsoft.Extensions.Logging;

namespace api.Endpoints
{
    public static class GoalEndpoints
    {
        public static void MapGoalEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/goals", async (Client supabase, Goal request, ILogger<Program> logger) =>
            {
                logger.LogInformation("Creating new goal");
                var response = await supabase.From<Goal>().Insert(request);
                logger.LogInformation("Goal created with ID {Id}", response.Models.First().Id);
                return Results.Ok(response.Models.First());
            });

            app.MapGet("/api/goals", async (Client supabase, ILogger<Program> logger) =>
            {
                logger.LogInformation("Retrieving all goals");
                var response = await supabase.From<Goal>().Get();
                logger.LogInformation("Retrieved {Count} goals", response.Models.Count);
                return Results.Ok(response.Models);
            });

            app.MapGet("/api/goals/{id}", async (Client supabase, long id, ILogger<Program> logger) =>
            {
                logger.LogInformation("Retrieving goal with ID {Id}", id);
                var response = await supabase.From<Goal>().Where(g => g.Id == id).Get();
                var goal = response.Models.FirstOrDefault();
                if (goal == null)
                {
                    logger.LogWarning("Goal with ID {Id} not found", id);
                }
                else
                {
                    logger.LogInformation("Goal with ID {Id} retrieved", id);
                }
                return Results.Ok(goal);
            });

            app.MapPut("/api/goals/{id}", async (Client supabase, long id, Goal request, ILogger<Program> logger) =>
            {
                logger.LogInformation("Updating goal with ID {Id}", id);
                await supabase.From<Goal>().Where(g => g.Id == id).Update(request);
                logger.LogInformation("Goal with ID {Id} updated", id);
                return Results.Ok();
            });

            app.MapDelete("/api/goals/{id}", async (Client supabase, long id, ILogger<Program> logger) =>
            {
                logger.LogInformation("Deleting goal with ID {Id}", id);
                await supabase.From<Goal>().Where(g => g.Id == id).Delete();
                logger.LogInformation("Goal with ID {Id} deleted", id);
                return Results.NoContent();
            });
        }
    }
}