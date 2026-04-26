using api.Models;
using Supabase;

namespace api.Endpoints
{
    public static class TransactionEndpoints
    {
        public static void MapTransactionEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/transactions", async (Client supabase, Transaction request) =>
            {
                try
                {
                    var response = await supabase.From<Transaction>().Insert(request);
                    return Results.Ok(response.Models.First());
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            }).RequireAuthorization();

            app.MapGet("/api/transactions", async (Client supabase, HttpContext ctx) =>
            {
                try
                {
                    var userId = ctx.User.FindFirst("sub")?.Value;
                    if (userId == null)
                        return Results.Json(new { error = "Unauthorized" }, statusCode: 401);

                    var response = await supabase.From<Transaction>()
                        .Where(t => t.UserId == userId)
                        .Get();
                    return Results.Ok(response.Models);
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            }).RequireAuthorization();

            app.MapGet("/api/transactions/{id}", async (Client supabase, string id) =>
            {
                try
                {
                    var response = await supabase.From<Transaction>().Where(t => t.Id == id).Get();
                    var transaction = response.Models.FirstOrDefault();
                    if (transaction == null)
                        return Results.Json(new { error = "NotFound", message = $"Transaction {id} not found." }, statusCode: 404);
                    return Results.Ok(transaction);
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            }).RequireAuthorization();

            app.MapPut("/api/transactions/{id}", async (Client supabase, string id, Transaction request) =>
            {
                try
                {
                    await supabase.From<Transaction>().Where(t => t.Id == id).Update(request);
                    return Results.Ok(new { message = "Transaction updated." });
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            }).RequireAuthorization();

            app.MapDelete("/api/transactions/{id}", async (Client supabase, string id) =>
            {
                try
                {
                    await supabase.From<Transaction>().Where(t => t.Id == id).Delete();
                    return Results.NoContent();
                }
                catch (Exception ex)
                {
                    return Results.Json(new { error = "ServerError", message = ex.Message }, statusCode: 500);
                }
            }).RequireAuthorization();
        }
    }
}