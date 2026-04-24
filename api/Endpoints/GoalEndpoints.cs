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
                try
                {
                    var response = await supabase.From<Goal>().Insert(request);
                    return Results.Ok(response.Models.First());
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapGet("/api/goals", async (Client supabase) =>
            {
                try
                {
                    var response = await supabase.From<Goal>().Get();
                    return Results.Ok(response.Models);
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapGet("/api/goals/{id}", async (Client supabase, long id) =>
            {
                try
                {
                    var response = await supabase.From<Goal>().Where(g => g.Id == id).Get();
                    var goal = response.Models.FirstOrDefault();
                    if (goal == null)
                        return Results.Json(new { error = "NotFound", message = $"Goal {id} not found." }, statusCode: 404);

                    return Results.Ok(goal);
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapPut("/api/goals/{id}", async (Client supabase, long id, Goal request) =>
            {
                try
                {
                    await supabase.From<Goal>().Where(g => g.Id == id).Update(request);
                    return Results.Ok(new { message = "Goal updated." });
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapDelete("/api/goals/{id}", async (Client supabase, long id) =>
            {
                try
                {
                    await supabase.From<Goal>().Where(g => g.Id == id).Delete();
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