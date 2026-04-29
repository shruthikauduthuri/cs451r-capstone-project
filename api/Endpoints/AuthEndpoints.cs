using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api;
using api.Contracts.Auth;
using api.Models;
using Supabase;
using api.Services.Auth;
using api.Services.Profile;

namespace api.Endpoints
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/register", Register);
        app.MapPost("/api/auth/login", Login);
        app.MapPost("/api/auth/logout", Logout);
        app.MapPost("/api/auth/reset-password", ResetPassword);
        app.MapGet("/api/auth/session", GetSession);
    }

    public static async Task<IResult> Register(
        IAuthService auth,
        IProfileService profiles,
        RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return Results.BadRequest("Email is required");

        var (userId, email, token) = await auth.SignUp(request.Email, request.Password);

        if (userId == null)
            return Results.BadRequest("Registration failed");

        if (!long.TryParse(userId, out _))
            return Results.BadRequest("Invalid user ID");

        var profile = new Profile
        {
            Id = userId,
            UserName = email!,
            Created_at = DateTime.UtcNow
        };

        await profiles.CreateProfile(profile);

        return Results.Ok(new
        {
            Token = token,
            UserId = userId
        });
    }

    public static async Task<IResult> Login(
        IAuthService auth,
        LoginRequest request)
    {
        var (userId, _, token) = await auth.SignIn(request.Email, request.Password);

        if (userId == null)
            return Results.Unauthorized();

        return Results.Ok(new
        {
            Token = token,
            UserId = userId
        });
    }

    public static async Task<IResult> Logout(IAuthService auth)
    {
        await auth.SignOut();
        return Results.Ok();
    }

    public static async Task<IResult> ResetPassword(
        IAuthService auth,
        ResetPasswordRequest request)
    {
        await auth.ResetPassword(request.Email);
        return Results.Ok("Password reset email sent.");
    }

    public static Task<IResult> GetSession(IAuthService auth)
    {
        var session = auth.GetSession();

        if (session == null)
            return Task.FromResult(Results.Unauthorized());

        return Task.FromResult(Results.Ok(new
        {
            Id = session.Value.UserId,
            Email = session.Value.Email
        }));
    }
    }
}