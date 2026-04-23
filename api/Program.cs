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

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.MapOpenApi();
}

app.MapAuthEndpoints();
app.MapUserEndpoints();
app.MapHouseholdEndpoints();
app.MapBudgetEndpoints();
app.MapTransactionEndpoints();
app.MapGoalEndpoints();
app.MapSharedExpenseEndpoints();

app.UseHttpsRedirection();



app.Run();