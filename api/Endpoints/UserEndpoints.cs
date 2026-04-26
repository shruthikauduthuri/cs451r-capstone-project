using Microsoft.Extensions.Logging;
using Supabase;

namespace api.Endpoints
{
    public static class UserEndpoints
    {
        public static void MapUserEndpoints(this IEndpointRouteBuilder app)
        {
            // Now that JWT middleware handles auth, we just read the claims directly
            app.MapGet("/api/users/me", async (Client supabase, HttpContext ctx, ILogger<Program> logger) =>
            {
                try
                {
                    var userId = ctx.User.FindFirst("sub")?.Value;
                    var email = ctx.User.FindFirst("email")?.Value;

                    if (userId == null)
                        return Results.Json(new { error = "Unauthorized", message = "Missing or invalid token" }, statusCode: 401);

                    // Fetch the user's profile from the database
                    var response = await supabase.From<api.Models.Profile>()
                        .Where(p => p.Id == userId)
                        .Get();

                    var profile = response.Models.FirstOrDefault();
                    if (profile == null)
                        return Results.Json(new { error = "NotFound", message = "Profile not found." }, statusCode: 404);

                    logger.LogInformation("GET /api/users/me - User {UserId} fetched successfully.", userId);
                    return Results.Ok(new { userId, email, profile });
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "GET /api/users/me - Failed.");
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            }).RequireAuthorization();

            app.MapPost("/api/users/transition", async (Client supabase, HttpContext ctx, ILogger<Program> logger) =>
            {
                try
                {
                    var userId = ctx.User.FindFirst("sub")?.Value;
                    if (userId == null)
                        return Results.Json(new { error = "Unauthorized", message = "No active session" }, statusCode: 401);

                    logger.LogInformation("POST /api/users/transition - User {UserId} transitioning account.", userId);
                    // TODO: implement transition logic
                    return Results.Ok(new { message = "Account transitioned" });
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "POST /api/users/transition - Failed.");
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            }).RequireAuthorization();
        }
    }
}