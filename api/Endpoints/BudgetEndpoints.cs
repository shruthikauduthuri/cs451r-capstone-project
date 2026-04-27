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
    public static class BudgetEndpoints
    {
        public static void MapBudgetEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/budgets", async (Client supabase, Budget request, ILogger<Program> logger) =>
            {
                logger.LogInformation("Creating new budget");
                var response = await supabase.From<Budget>().Insert(request);
                logger.LogInformation("Budget created with ID {Id}", response.Models.First().Id);
                return Results.Ok(response.Models.First());
            });

            app.MapGet("/api/budgets", async (Client supabase, ILogger<Program> logger) =>
            {
                logger.LogInformation("Retrieving all budgets");
                var response = await supabase.From<Budget>().Get();
                logger.LogInformation("Retrieved {Count} budgets", response.Models.Count);
                return Results.Ok(response.Models);
            });

            app.MapGet("/api/budgets/{id}", async (Client supabase, string id, ILogger<Program> logger) =>
            {
                logger.LogInformation("Retrieving budget with ID {Id}", id);
                var response = await supabase.From<Budget>().Where(b => b.Id == id).Get();
                var budget = response.Models.FirstOrDefault();
                if (budget == null)
                {
                    logger.LogWarning("Budget with ID {Id} not found", id);
                }
                else
                {
                    logger.LogInformation("Budget with ID {Id} retrieved", id);
                }
                return Results.Ok(budget);
            });

            app.MapPut("/api/budgets/{id}", async (Client supabase, string id, Budget request, ILogger<Program> logger) =>
            {
                logger.LogInformation("Updating budget with ID {Id}", id);
                await supabase.From<Budget>().Where(b => b.Id == id).Update(request);
                logger.LogInformation("Budget with ID {Id} updated", id);
                return Results.Ok();
            });

            app.MapDelete("/api/budgets/{id}", async (Client supabase, string id, ILogger<Program> logger) =>
            {
                logger.LogInformation("Deleting budget with ID {Id}", id);
                await supabase.From<Budget>().Where(b => b.Id == id).Delete();
                logger.LogInformation("Budget with ID {Id} deleted", id);
                return Results.NoContent();
            });
        }
    }
}