using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api;
using api.Contracts;
using api.Models;
using Supabase;

namespace api.Endpoints
{
    public static class GoalEndpoints
    {
        public static void MapGoalEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/goals", async (Client supabase, Goal request) =>
            {
                var response = await supabase.From<Goal>().Insert(request);
                return Results.Ok(response.Models.First());
            });

            app.MapGet("/api/goals", async (Client supabase) =>
            {
                var response = await supabase.From<Goal>().Get();
                return Results.Ok(response.Models);
            });

            app.MapGet("/api/goals/{id}", async (Client supabase, string id) =>
            {
                var response = await supabase.From<Goal>().Where(g => g.Id == id).Get();
                var goal = response.Models.FirstOrDefault();
                if (goal == null)
                {
                    return Results.NotFound("Goal not found");
                }
                else
                {
                    return Results.Ok(goal);
                }
            });

            app.MapPut("/api/goals/{id}", async (Client supabase, string id, Goal request) =>
            {
                await supabase.From<Goal>().Where(g => g.Id == id).Update(request);
                return Results.Ok();
            });

            app.MapDelete("/api/goals/{id}", async (Client supabase, string id) =>
            {
                await supabase.From<Goal>().Where(g => g.Id == id).Delete();
                return Results.NoContent();
            });
        }
    }
}