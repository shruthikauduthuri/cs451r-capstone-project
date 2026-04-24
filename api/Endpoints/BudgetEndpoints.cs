using api.Models;
using Supabase;

namespace api.Endpoints
{
    public static class BudgetEndpoints
    {
        public static void MapBudgetEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/budgets", async (Client supabase, Budget request) =>
            {
                try
                {
                    var response = await supabase.From<Budget>().Insert(request);
                    return Results.Ok(response.Models.First());
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapGet("/api/budgets", async (Client supabase) =>
            {
                try
                {
                    var response = await supabase.From<Budget>().Get();
                    return Results.Ok(response.Models);
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapGet("/api/budgets/{id}", async (Client supabase, long id) =>
            {
                try
                {
                    var response = await supabase.From<Budget>().Where(b => b.Id == id).Get();
                    var budget = response.Models.FirstOrDefault();
                    if (budget == null)
                        return Results.Json(new { error = "NotFound", message = $"Budget {id} not found." }, statusCode: 404);

                    return Results.Ok(budget);
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapPut("/api/budgets/{id}", async (Client supabase, long id, Budget request) =>
            {
                try
                {
                    await supabase.From<Budget>().Where(b => b.Id == id).Update(request);
                    return Results.Ok(new { message = "Budget updated." });
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            });

            app.MapDelete("/api/budgets/{id}", async (Client supabase, long id) =>
            {
                try
                {
                    await supabase.From<Budget>().Where(b => b.Id == id).Delete();
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