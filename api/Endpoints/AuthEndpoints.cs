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
                try
                {
                    var auth = await supabase.Auth.SignUp(request.Email, request.Password);
                    if (auth?.User == null)
                        return Results.Json(new { error = "RegistrationFailed", message = "Could not create account." }, statusCode: 400);

                    return Results.Ok(new { token = auth.AccessToken, userId = auth.User.Id });
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapPost("/api/auth/login", async (Client supabase, LoginRequest request) =>
            {
                try
                {
                    var auth = await supabase.Auth.SignIn(request.Email, request.Password);
                    if (auth?.User == null)
                        return Results.Json(new { error = "Unauthorized", message = "Invalid email or password." }, statusCode: 401);

                    return Results.Ok(new { token = auth.AccessToken, userId = auth.User.Id });
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapPost("/api/auth/logout", async (Client supabase) =>
            {
                try
                {
                    await supabase.Auth.SignOut();
                    return Results.Ok(new { message = "Logged out successfully." });
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapPost("/api/auth/reset-password", async (Client supabase, ResetPasswordRequest request) =>
            {
                try
                {
                    await supabase.Auth.ResetPasswordForEmail(request.Email);
                    return Results.Ok(new { message = "Password reset email sent." });
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapGet("/api/auth/session", async (Client supabase) =>
            {
                try
                {
                    var session = supabase.Auth.CurrentSession;
                    if (session == null || session.User == null)
                        return Results.Json(new { error = "Unauthorized", message = "No active session." }, statusCode: 401);

                    return Results.Ok(new { userId = session.User.Id, email = session.User.Email });
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });
        }
    }
}