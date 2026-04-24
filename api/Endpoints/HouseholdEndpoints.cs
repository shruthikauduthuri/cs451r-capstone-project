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
                try
                {
                    var user = supabase.Auth.CurrentUser;
                    if (user == null)
                        return Results.Json(new { error = "Unauthorized", message = "No active session." }, statusCode: 401);
                    if (user.Id == null)
                        return Results.Json(new { error = "BadRequest", message = "User ID is null." }, statusCode: 400);

                    var joinCode = Guid.NewGuid().ToString().Substring(0, 6).ToUpper();
                    var response = await supabase.From<Household>().Insert(new Household
                    {
                        AdminId = user.Id,
                        JoinCode = joinCode
                    });
                    return Results.Ok(response.Models.First());
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapPost("/api/households/join", async (Client supabase, JoinHouseholdRequest request) =>
            {
                try
                {
                    var user = supabase.Auth.CurrentUser;
                    if (user == null)
                        return Results.Json(new { error = "Unauthorized", message = "No active session." }, statusCode: 401);

                    // TODO: lookup household by join code and add member
                    return Results.Ok(new { message = "Joined household." });
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapGet("/api/households/{id}", async (Client supabase, long id) =>
            {
                try
                {
                    var response = await supabase.From<Household>().Where(h => h.Id == id).Get();
                    var household = response.Models.FirstOrDefault();
                    if (household == null)
                        return Results.Json(new { error = "NotFound", message = $"Household {id} not found." }, statusCode: 404);

                    return Results.Ok(household);
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapPut("/api/households/{id}", async (Client supabase, long id, HouseholdUpdateRequest request) =>
            {
                try
                {
                    // TODO: admin check
                    return Results.Ok(new { message = "Household updated." });
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapPut("/api/households/{id}/members/{userId}", async (Client supabase, long id, string userId) =>
            {
                try
                {
                    // TODO: implement member update
                    return Results.Ok(new { message = "Member updated." });
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapDelete("/api/households/{id}/members/{userId}", async (Client supabase, long id, string userId) =>
            {
                try
                {
                    // TODO: implement member removal
                    return Results.NoContent();
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });
        }
    }
}