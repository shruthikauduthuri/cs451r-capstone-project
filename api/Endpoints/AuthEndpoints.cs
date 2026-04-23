using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api;
using api.Contracts.Auth;
using api.Models;
using Supabase;

namespace api.Endpoints
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/auth/register", async (Client supabase, RegisterRequest request) =>
            {
                var auth = await supabase.Auth.SignUp(request.Email, request.Password);

                if (auth?.User == null)
                    return Results.BadRequest("Registration failed");

                return Results.Ok(new
                {
                    Token = auth.AccessToken,
                    UserId = auth.User.Id
                });
            });

            app.MapPost("/api/auth/login", async (Client supabase, LoginRequest request) =>
            {
                var auth = await supabase.Auth.SignIn(request.Email, request.Password);

                if (auth?.User == null)
                    return Results.Unauthorized();

                return Results.Ok(new
                {
                    Token = auth.AccessToken,
                    UserId = auth.User.Id
                });
            });

            app.MapPost("/api/auth/logout", async (Client supabase) =>
            {
                await supabase.Auth.SignOut();
                return Results.Ok();
            });

            app.MapPost("/api/auth/reset-password", async (Client supabase, ResetPasswordRequest request) =>
            {
                await supabase.Auth.ResetPasswordForEmail(request.Email);
                return Results.Ok("Password reset email sent.");
            });

            app.MapGet("/api/auth/session", async (Client supabase) =>
            {
                var session = supabase.Auth.CurrentSession;

                if (session == null || session.User == null)
                    return Results.Unauthorized();

                return Results.Ok(new
                {
                    session.User.Id,
                    session.User.Email
                });
            });
        }
    }
}