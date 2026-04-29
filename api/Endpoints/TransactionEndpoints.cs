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
    public static class TransactionEndpoints
    {
        public static void MapTransactionEndpoints(this WebApplication app)
        {
            app.MapPost("/api/transactions", async (Client supabase, Transaction request) =>
            {
                var response = await supabase.From<Transaction>().Insert(request);
                return Results.Ok(response.Models.First());
            });

            app.MapGet("/api/transactions", async (Client supabase) =>
            {
                var response = await supabase.From<Transaction>().Get();
                return Results.Ok(response.Models);
            });

            app.MapGet("/api/transactions/{id}", async (Client supabase, string id) =>
            {
                var response = await supabase.From<Transaction>().Where(t => t.Id == id).Get();
                var transaction = response.Models.FirstOrDefault();
                if (transaction == null)
                {
                }
                else
                {
                }
                return Results.Ok(transaction);
            });

            app.MapPut("/api/transactions/{id}", async (Client supabase, string id, Transaction request) =>
            {
                await supabase.From<Transaction>().Where(t => t.Id == id).Update(request);
                return Results.Ok();
            });

            app.MapDelete("/api/transactions/{id}", async (Client supabase, string id) =>
            {
                await supabase.From<Transaction>().Where(t => t.Id == id).Delete();
                return Results.NoContent();
            });
        }
    }
}