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
    public static class SharedExpenseEndpoints
    {
        public static void MapSharedExpenseEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/api/shared-expenses", async (Client supabase, ILogger<Program> logger) =>
            {
                logger.LogInformation("Retrieving all shared expenses");
                var response = await supabase.From<SharedExpense>().Get();
                logger.LogInformation("Retrieved {Count} shared expenses", response.Models.Count);
                return Results.Ok(response.Models);
            });

            app.MapPost("/api/shared-expenses", async (Client supabase, SharedExpense request, ILogger<Program> logger) =>
            {
                logger.LogInformation("Creating new shared expense");
                var response = await supabase.From<SharedExpense>().Insert(request);
                logger.LogInformation("Shared expense created with ID {Id}", response.Models.First().Id);
                return Results.Ok(response.Models.First());
            });

            app.MapPut("/api/shared-expenses/{id}", async (Client supabase, string id, SharedExpense request, ILogger<Program> logger) =>
            {
                logger.LogInformation("Updating shared expense with ID {Id}", id);
                await supabase.From<SharedExpense>().Where(se => se.Id == id).Update(request);
                logger.LogInformation("Shared expense with ID {Id} updated", id);
                return Results.Ok();
            });
        }
    }
}