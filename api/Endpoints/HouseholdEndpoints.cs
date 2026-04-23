using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api;
using api.Contracts.Household;
using api.Models;
using Supabase;

namespace api.Endpoints
{
    public static class HouseholdEndpoints
    {
        public static void MapHouseholdEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/households", async (Client supabase) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null) return Results.Unauthorized();

                var joinCode = Guid.NewGuid().ToString().Substring(0, 6);

                var response = await supabase.From<Household>().Insert(new Household
                {
                    AdminId = user.Id,
                    JoinCode = joinCode
                });

                return Results.Ok(response.Models.First());
            });

            app.MapPost("/api/households/join", async (Client supabase, JoinHouseholdRequest request) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null) return Results.Unauthorized();

                // TODO: lookup household and add member
                return Results.Ok();
            });

            app.MapGet("/api/households/{id}", async (Client supabase, long id) =>
            {
                var household = await supabase.From<Household>()
                    .Where(h => h.Id == id)
                    .Get();

                return Results.Ok(household.Models.FirstOrDefault());
            });

            app.MapPut("/api/households/{id}", async (Client supabase, long id, HouseholdUpdateRequest request) =>
            {
                // TODO: Admin check
                return Results.Ok();
            });

            app.MapPut("/api/households/{id}/members/{userId}", async (Client supabase, long id, string userId) =>
            {
                return Results.Ok();
            });

            app.MapDelete("/api/households/{id}/members/{userId}", async (Client supabase, long id, string userId) =>
            {
                return Results.Ok();
            });
        }
    }
}