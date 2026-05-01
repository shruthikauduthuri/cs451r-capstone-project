using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api;
using api.Contracts;
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
                var response = await supabase.From<SharedExpense>().Get();
                return Results.Ok(response.Models);
            });

            app.MapPost("/api/shared-expenses", async (Client supabase, SharedExpense request) =>
            {
                var response = await supabase.From<SharedExpense>().Insert(request);
                return Results.Ok(response.Models.First());
            });

            app.MapPut("/api/shared-expenses/{id}", async (Client supabase, string id, SharedExpense request) =>
            {
                await supabase.From<SharedExpense>().Where(se => se.Id == id).Update(request);
                return Results.Ok();
            });
        }
    }
}