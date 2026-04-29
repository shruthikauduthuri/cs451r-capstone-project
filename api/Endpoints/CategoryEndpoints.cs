using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api;
using api.Contracts;
using api.Models;
using Supabase;
using api.Contracts.Category;

namespace api.Endpoints
{
    public static class CategoryEndpoints
    {
        public static void MapCategoryEndpoints(this WebApplication app)
        {
            app.MapGet("api/categories", async (Client supabase) =>
            {
                var categories = await supabase.From<Category>().Get();
                return Results.Ok(categories.Models);
            });

            app.MapGet("api/categories/{id}", async (Client supabase, string id) =>
            {
                var category = await supabase.From<Category>().Where(c => c.Id == id).Get();
                return Results.Ok(category.Models.FirstOrDefault());
            });

            app.MapPost("api/categories", async (Client supabase, CreateCategoryRequest request) =>
            {
                var user = supabase.Auth.CurrentUser;
                if (user == null)                {
                    return Results.Unauthorized();
                }
                if(string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Type))
                {
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

            app.MapPut("api/categories/{id}", async (Client supabase, string id, UpdateCategoryRequest request) =>
            {
                if(string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Type))
                {
                    return Results.BadRequest("Name and Type are required fields.");
                }

                var categoryToUpdate = new Category
                {
                    Id = id,
                    Name = request.Name,
                    Type = request.Type,
                    Created_at = DateTimeOffset.UtcNow
                };
                await supabase.From<Category>().Where(c => c.Id == id).Update(categoryToUpdate);
                return Results.Ok();
            });
            
            app.MapDelete("api/categories/{id}", async (Client supabase, string id) =>
            {
                await supabase.From<Category>().Where(c => c.Id == id).Delete();
                return Results.Ok();
            });
        }
    }
}