using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api;
using api.Contracts.Auth;
using api.Models;
using Supabase;
using Microsoft.Extensions.Logging;

namespace api.Endpoints
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/auth/register", async (Client supabase, RegisterRequest request, ILogger logger) =>
            {
                logger.LogInformation("Registration attempt for {Email}", request.Email);
                var auth = await supabase.Auth.SignUp(request.Email, request.Password);

                if (auth?.User == null)
                {
                    logger.LogWarning("Registration failed for {Email}", request.Email);
                    return Results.BadRequest("Registration failed");
                }

                logger.LogInformation("Registration successful for user {UserId}", auth.User.Id);

                return Results.Ok(new
                {
                    Token = auth.AccessToken,
                    UserId = auth.User.Id
                });
            });

            app.MapPost("/api/auth/login", async (Client supabase, LoginRequest request, ILogger logger) =>
            {
                logger.LogInformation("Login attempt for {Email}", request.Email);

                var auth = await supabase.Auth.SignIn(request.Email, request.Password);

                if (auth?.User == null)
                {
                    logger.LogWarning("Login failed for {Email}", request.Email);
                    return Results.Unauthorized();
                }

                logger.LogInformation("Login success for user {UserId}", auth.User.Id);

                return Results.Ok(new
                {
                    Token = auth.AccessToken,
                    UserId = auth.User.Id
                });
            });

            app.MapPost("/api/auth/logout", async (Client supabase, ILogger logger) =>
            {
                await supabase.Auth.SignOut();
                logger.LogInformation("User logged out successfully.");
                return Results.Ok();
            });

            app.MapPost("/api/auth/reset-password", async (Client supabase, ResetPasswordRequest request, ILogger logger) =>
            {
                await supabase.Auth.ResetPasswordForEmail(request.Email);
                logger.LogInformation("Password reset email sent to {Email}", request.Email);
                return Results.Ok("Password reset email sent.");
            });

            app.MapGet("/api/auth/session", async (Client supabase, ILogger logger) =>
            {
                logger.LogInformation("Retrieving session for user.");
                var session = supabase.Auth.CurrentSession;

                if (session == null || session.User == null)
                {
                    logger.LogWarning("Session not found.");
                    return Results.Unauthorized();
                }
                logger.LogInformation("Session retrieved for user {UserId}", session.User.Id);
                return Results.Ok(new
                {
                    session.User.Id,
                    session.User.Email
                });
            });
        }
    }
}