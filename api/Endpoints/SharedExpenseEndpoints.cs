using api.Models;
using Supabase;

namespace api.Endpoints
{
    public static class SharedExpenseEndpoints
    {
        public static void MapSharedExpenseEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/api/shared-expenses", async (Client supabase, HttpContext ctx) =>
            {
                try
                {
                    var userId = ctx.User.FindFirst("sub")?.Value;
                    if (userId == null)
                        return Results.Json(new { error = "Unauthorized" }, statusCode: 401);

                    var response = await supabase.From<SharedExpense>()
                        .Where(se => se.CreatedBy == userId)
                        .Get();
                    return Results.Ok(response.Models);
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            }).RequireAuthorization();

            app.MapPost("/api/shared-expenses", async (Client supabase, SharedExpense request) =>
            {
                try
                {
                    var response = await supabase.From<SharedExpense>().Insert(request);
                    return Results.Ok(response.Models.First());
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            }).RequireAuthorization();

            app.MapPut("/api/shared-expenses/{id}", async (Client supabase, string id, SharedExpense request) =>
            {
                try
                {
                    await supabase.From<SharedExpense>().Where(se => se.Id == id).Update(request);
                    return Results.Ok(new { message = "Shared expense updated." });
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            }).RequireAuthorization();
        }
    }
}