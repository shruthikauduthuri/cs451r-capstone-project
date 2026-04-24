using api.Contracts.User;
using api.Models;
using Microsoft.Extensions.Logging;
using Supabase;

namespace api.Endpoints
{
    public static class UserEndpoints
    {
        public static void MapUserEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/api/users/me", (HttpRequest req, ILogger<Program> logger) =>
            {
                var authHeader = req.Headers.Authorization.ToString();

                if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    logger.LogWarning("GET /api/users/me - Missing or malformed Authorization header. IP: {IP}",
                        req.HttpContext.Connection.RemoteIpAddress);
                    return Results.Json(new { error = "Unauthorized", message = "Missing or invalid token" }, statusCode: 401);
                }

                var token = authHeader.Replace("Bearer ", "");
                var parts = token.Split('.');

                if (parts.Length != 3)
                {
                    logger.LogWarning("GET /api/users/me - Malformed JWT token.");
                    return Results.Json(new { error = "Unauthorized", message = "Malformed token" }, statusCode: 401);
                }

                try
                {
                    var payload = parts[1];
                    var jsonBytes = Convert.FromBase64String(PadBase64(payload));
                    var json = System.Text.Encoding.UTF8.GetString(jsonBytes);

                    logger.LogInformation("GET /api/users/me - Token decoded successfully.");
                    return Results.Ok(new { message = "Token received", payload = json });
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "GET /api/users/me - Failed to decode token.");
                    return Results.Json(new { error = "ServerError", message = "Failed to process token" }, statusCode: 500);
                }
            });

            app.MapPost("/api/users/transition", async (Client supabase, ILogger<Program> logger) =>
            {
                var user = supabase.Auth.CurrentUser;

                if (user == null)
                {
                    logger.LogWarning("POST /api/users/transition - No authenticated user found.");
                    return Results.Json(new { error = "Unauthorized", message = "No active session" }, statusCode: 401);
                }

                logger.LogInformation("POST /api/users/transition - User {UserId} transitioning account.", user.Id);
                // TODO: implement transition logic
                return Results.Ok(new { message = "Account transitioned" });
            });
        }

        static string PadBase64(string base64)
        {
            int mod = base64.Length % 4;
            return mod switch
            {
                2 => base64 + "==",
                3 => base64 + "=",
                _ => base64
            };
        }
    }
}