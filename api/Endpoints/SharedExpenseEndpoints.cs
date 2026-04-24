using api.Models;
using Supabase;

namespace api.Endpoints
{
    public static class SharedExpenseEndpoints
    {
        public static void MapSharedExpenseEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/api/shared-expenses", async (Client supabase) =>
            {
                try
                {
                    var response = await supabase.From<SharedExpense>().Get();
                    return Results.Ok(response.Models);
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

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
            });

            app.MapPut("/api/shared-expenses/{id}", async (Client supabase, long id, SharedExpense request) =>
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
            });
        }
    }
}