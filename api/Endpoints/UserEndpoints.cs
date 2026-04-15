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
    public static class UserEndpoints
    {
        public static void MapUserEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/api/users/me", async (Client supabase) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null) return Results.Unauthorized();

                return Results.Ok(user);
            });

            app.MapPut("/api/users/me", async (Client supabase, UpdateUserRequest request) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null) return Results.Unauthorized();

                // Example update (extend to your DB model)
                await supabase.From<User>()
                    .Where(u => u.Id == user.Id)
                    .Set(u => u.Name, request.DisplayName)
                    .Update();

                return Results.Ok();
            });

            app.MapPost("/api/users/transition", async (Client supabase) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null) return Results.Unauthorized();

                // TODO: implement transition logic
                return Results.Ok("Account transitioned");
            });
        }
    }
}