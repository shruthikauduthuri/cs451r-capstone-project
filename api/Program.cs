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
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped(_ => 
    new Client(
        builder.Configuration["SupabaseUrl"] ?? throw new InvalidOperationException("Supabase URL is not configured"),
        builder.Configuration["SupabaseKey"] ?? throw new InvalidOperationException("Supabase Key is not configured"),
        new SupabaseOptions
        {
            AutoRefreshToken = true,
            AutoConnectRealtime = true
        }
    ));

builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
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