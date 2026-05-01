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

            app.MapGet("/api/budgets/{id}", async (Client supabase, string id) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    return Results.Unauthorized();
                }
                var response = await supabase.From<Budget>().Where(b => b.Id == id).Get();
                var budget = response.Models.FirstOrDefault();
                if (budget == null)
                {
                    return Results.NotFound("Account not found");
                }
                return Results.Ok(budget);
            });

            app.MapPut("/api/budgets/{id}", async (Client supabase, string id, Budget request) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    return Results.Unauthorized();
                }

                var accountResponse = await supabase.From<Account>()
                    .Where(a => a.Id == id && a.UserId == user.Id)
                    .Get();

                var account = accountResponse.Models?.FirstOrDefault();
                if (account == null)
                {
                    return Results.NotFound("Account not found");
                }
                await supabase.From<Budget>().Where(b => b.Id == id).Update(request);
                return Results.Ok();
            });

            app.MapDelete("/api/budgets/{id}", async (Client supabase, string id) =>
            {
                await supabase.From<Budget>().Where(b => b.Id == id).Delete();
                return Results.NoContent();
            });
        }
    }
}