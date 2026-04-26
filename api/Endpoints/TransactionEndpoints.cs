using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api;
using api.Contracts;
using api.Models;
using Supabase;
using Microsoft.Extensions.Logging;

namespace api.Endpoints
{
    public static class TransactionEndpoints
    {
        public static void MapTransactionEndpoints(this WebApplication app)
        {
            app.MapPost("/api/transactions", async (Client supabase, Transaction request, ILogger logger) =>
            {
                logger.LogInformation("Creating new transaction");
                var response = await supabase.From<Transaction>().Insert(request);
                logger.LogInformation("Transaction created with ID {Id}", response.Models.First().Id);
                return Results.Ok(response.Models.First());
            });

            app.MapGet("/api/transactions", async (Client supabase, ILogger logger) =>
            {
                logger.LogInformation("Retrieving all transactions");
                var response = await supabase.From<Transaction>().Get();
                logger.LogInformation("Retrieved {Count} transactions", response.Models.Count);
                return Results.Ok(response.Models);
            });

            app.MapGet("/api/transactions/{id}", async (Client supabase, long id, ILogger logger) =>
            {
                logger.LogInformation("Retrieving transaction with ID {Id}", id);
                var response = await supabase.From<Transaction>().Where(t => t.Id == id).Get();
                var transaction = response.Models.FirstOrDefault();
                if (transaction == null)
                {
                    logger.LogWarning("Transaction with ID {Id} not found", id);
                }
                else
                {
                    logger.LogInformation("Transaction with ID {Id} retrieved", id);
                }
                return Results.Ok(transaction);
            });

            app.MapPut("/api/transactions/{id}", async (Client supabase, long id, Transaction request, ILogger logger) =>
            {
                logger.LogInformation("Updating transaction with ID {Id}", id);
                await supabase.From<Transaction>().Where(t => t.Id == id).Update(request);
                logger.LogInformation("Transaction with ID {Id} updated", id);
                return Results.Ok();
            });

            app.MapDelete("/api/transactions/{id}", async (Client supabase, long id, ILogger logger) =>
            {
                logger.LogInformation("Deleting transaction with ID {Id}", id);
                await supabase.From<Transaction>().Where(t => t.Id == id).Delete();
                logger.LogInformation("Transaction with ID {Id} deleted", id);
                return Results.NoContent();
            });
        }
    }
}