using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api;
using api.Contracts;
using api.Models;
using Supabase;
using Microsoft.Extensions.Logging;
using api.Contracts.Category;

namespace api.Endpoints
{
    public static class CategoryEndpoints
    {
        public static void MapCategoryEndpoints(this WebApplication app)
        {
            app.MapGet("api/categories", async (Client supabase, ILogger<Program> logger) =>
            {
                var categories = await supabase.From<Category>().Get();
                return Results.Ok(categories.Models);
            });

            app.MapGet("api/categories/{id}", async (Client supabase, long id, ILogger<Program> logger) =>
            {
                var category = await supabase.From<Category>().Where(c => c.Id == id).Get();
                return Results.Ok(category.Models.FirstOrDefault());
            });

            app.MapPost("api/categories", async (Client supabase, CreateCategoryRequest request, ILogger<Program> logger) =>
            {
                logger.LogInformation("Creating new category with name {Name}", request.Name);
                var user = supabase.Auth.CurrentUser;
                if (user == null)                {
                    logger.LogWarning("Unauthorized attempt to create category");
                    return Results.Unauthorized();
                }
                if(string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Type))
                {
                    logger.LogWarning("Invalid category creation request: Name and Type are required");
                    return Results.BadRequest("Name and Type are required fields.");
                }
                var categoryToInsert = new Category
                {
                    Name = request.Name,
                    Type = request.Type,
                    Created_at = DateTimeOffset.UtcNow,
                    UserId = user.Id!
                };
                var response = await supabase.From<Category>().Insert(categoryToInsert);
                return Results.Ok(response.Models.First());
            });

            app.MapPut("api/categories/{id}", async (Client supabase, UpdateCategoryRequest request, ILogger<Program> logger) =>
            {
                logger.LogInformation("Updating category with ID {Id}", request.Id);
                if(string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Type))
                {
                    logger.LogWarning("Invalid category update request for ID {Id}", request.Id);
                    return Results.BadRequest("Name and Type are required fields.");
                }

                var categoryToUpdate = new Category
                {
                    Id = request.Id,
                    Name = request.Name,
                    Type = request.Type,
                    Created_at = DateTimeOffset.UtcNow
                };
                await supabase.From<Category>().Where(c => c.Id == request.Id).Update(categoryToUpdate);
                return Results.Ok();
            });
            
            app.MapDelete("api/categories/{id}", async (Client supabase, long id, ILogger<Program> logger) =>
            {
                logger.LogInformation("Deleting category with ID {Id}", id);
                await supabase.From<Category>().Where(c => c.Id == id).Delete();
                return Results.Ok();
            });
        }
    }
}