using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Contracts;
using api.Models;
using Supabase;
using Microsoft.Extensions.Logging;
using api.Contracts.PrivacyRules;

namespace api.Endpoints
{
    public static class PrivacyEndpoints
    {
        public static void MapPrivacyEndpoints(this WebApplication app)
        {
            app.MapGet("api/privacy", async (Client supabase, ILogger<Program> logger) =>
            {
                logger.LogInformation("Accessing privacy policy");
                var privacyPolicy = await supabase.From<PrivacyRule>().Get();
                return Results.Ok(privacyPolicy);
            });
            
            app.MapGet("api/privacy/{id}", async (Client supabase, string id, ILogger<Program> logger) =>
            {
                logger.LogInformation("Accessing privacy policy with ID {Id}", id);
                var privacyPolicy = await supabase.From<PrivacyRule>().Where(p => p.Id == id).Get();
                return Results.Ok(privacyPolicy.Models.FirstOrDefault());
            });

             app.MapPost("api/privacy", async (Client supabase, CreatePrivacyRuleRequest request, ILogger<Program> logger) =>
            {
                logger.LogInformation("Creating new privacy policy");
                var user = supabase.Auth.CurrentUser;
                if (user == null)
                {
                    logger.LogWarning("Unauthorized attempt to create privacy policy");
                    return Results.Unauthorized();
                }
                var privacyRuleToInsert = new PrivacyRule
                {
                    UserId = request.UserId,
                    RuleType = request.RuleType,
                    Value = request.Value,
                    Created_at = DateTimeOffset.UtcNow
                };
                var response = await supabase.From<PrivacyRule>().Insert(privacyRuleToInsert);
                logger.LogInformation("Privacy policy created with ID {Id}", response.Models.First().Id);
                return Results.Ok(response.Models.First());
            });

             app.MapPut("api/privacy/{id}", async (Client supabase, string id, PrivacyRule request, ILogger<Program> logger) =>
            {
                logger.LogInformation("Updating privacy policy with ID {Id}", id);
                await supabase.From<PrivacyRule>().Where(p => p.Id == id).Update(request);
                logger.LogInformation("Privacy policy with ID {Id} updated", id);
                return Results.Ok();
            });

             app.MapDelete("api/privacy/{id}", async (Client supabase, string id, ILogger<Program> logger) =>
            {
                logger.LogInformation("Deleting privacy policy with ID {Id}", id);
                await supabase.From<PrivacyRule>().Where(p => p.Id == id).Delete();
                logger.LogInformation("Privacy policy with ID {Id} deleted", id);
                return Results.Ok();
            });
        }
    }
}