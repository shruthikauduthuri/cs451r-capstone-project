using api.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Supabase;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Logging
Log.Logger = new LoggerConfiguration()
    .WriteTo.File("logs/app.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();
builder.Host.UseSerilog();

// Supabase client
var supabaseUrl = builder.Configuration["Supabase:Url"]
    ?? throw new Exception("Supabase Url missing");
var supabaseKey = builder.Configuration["Supabase:Key"]
    ?? throw new Exception("Supabase Key missing");
var supabaseJwtSecret = builder.Configuration["Supabase:JwtSecret"]
    ?? throw new Exception("Supabase JwtSecret missing");

builder.Services.AddSingleton<Client>(_ =>
    new Client(supabaseUrl, supabaseKey)
);

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(supabaseJwtSecret)
            ),
            ValidateIssuer = true,
            ValidIssuer = $"{supabaseUrl}/auth/v1",
            ValidateAudience = true,
            ValidAudience = "authenticated",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// CORS
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

if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();
}

// Middleware order matters — CORS → Auth → endpoints
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();

// Endpoints
app.MapAuthEndpoints();
app.MapUserEndpoints();
app.MapHouseholdEndpoints();
app.MapBudgetEndpoints();
app.MapTransactionEndpoints();
app.MapGoalEndpoints();
app.MapSharedExpenseEndpoints();

app.Run();