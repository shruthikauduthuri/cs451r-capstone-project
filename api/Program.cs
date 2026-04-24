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
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();
Log.Logger = new LoggerConfiguration()
    .WriteTo.File("logs/app.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

var supabaseUrl = builder.Configuration["Supabase:Url"] 
        ?? throw new Exception("Supabase Url missing");

var supabaseKey = builder.Configuration["Supabase:Key"] 
    ?? throw new Exception("Supabase Key missing");

builder.Services.AddSingleton<Client>(_ =>
    new Client(supabaseUrl, supabaseKey)
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.MapOpenApi();
}

app.UseCors("AllowFrontend");

app.MapAuthEndpoints();
app.MapUserEndpoints();
app.MapHouseholdEndpoints();
app.MapBudgetEndpoints();
app.MapTransactionEndpoints();
app.MapGoalEndpoints();
app.MapSharedExpenseEndpoints();

app.UseHttpsRedirection();

app.Run();