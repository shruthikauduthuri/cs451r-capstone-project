using api;
using api.Contracts;
using api.Models;
using Supabase;
using api.Endpoints;
using MapAuthEndpoints = api.Endpoints.AuthEndpoints;
using MapUserEndpoints = api.Endpoints.UserEndpoints;
using MapHouseholdEndpoints = api.Endpoints.HouseholdEndpoints;
using MapBudgetEndpoints = api.Endpoints.BudgetEndpoints;
using MapTransactionEndpoints = api.Endpoints.TransactionEndpoints;
using MapGoalEndpoints = api.Endpoints.GoalEndpoints;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
builder.Logging.AddFilter("Microsoft", LogLevel.Warning);
builder.Logging.AddFilter("System", LogLevel.Warning);
builder.Logging.AddFilter("api", LogLevel.Information);

// Add services to the container.
// Learn more about configuring Swagger at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register Supabase client
builder.Services.AddScoped<Client>(sp => new Client(
    builder.Configuration["Supabase:Url"]!,
    builder.Configuration["Supabase:Key"]!
));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.MapAuthEndpoints();
app.MapUserEndpoints();
app.MapHouseholdEndpoints();
app.MapBudgetEndpoints();
app.MapTransactionEndpoints();
app.MapGoalEndpoints();
app.MapSharedExpenseEndpoints();

app.UseHttpsRedirection();
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Starting API in {Environment}", app.Environment.EnvironmentName);

app.Run();