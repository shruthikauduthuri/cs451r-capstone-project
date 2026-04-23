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
    public static class BudgetEndpoints
    {
        public static void MapBudgetEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/budgets", async (Client supabase, Budget request) =>
            {
                var response = await supabase.From<Budget>().Insert(request);
                return Results.Ok(response.Models.First());
            });

            app.MapGet("/api/budgets", async (Client supabase) =>
            {
                var response = await supabase.From<Budget>().Get();
                return Results.Ok(response.Models);
            });

            app.MapGet("/api/budgets/{id}", async (Client supabase, long id) =>
            {
                var response = await supabase.From<Budget>().Where(b => b.Id == id).Get();
                return Results.Ok(response.Models.FirstOrDefault());
            });

            app.MapPut("/api/budgets/{id}", async (Client supabase, long id, Budget request) =>
            {
                await supabase.From<Budget>().Where(b => b.Id == id).Update(request);
                return Results.Ok();
            });

            app.MapDelete("/api/budgets/{id}", async (Client supabase, long id) =>
            {
                await supabase.From<Budget>().Where(b => b.Id == id).Delete();
                return Results.NoContent();
            });
        }
    }
}