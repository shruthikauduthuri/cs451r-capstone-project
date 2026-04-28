using api.Endpoints;
using Supabase;

var builder = WebApplication.CreateBuilder(args);

// Logging (without problematic filters)
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// Register Supabase client
builder.Services.AddScoped<Client>(sp => 
{
    var options = new SupabaseOptions
    {
        AutoConnectRealtime = false,
        AutoRefreshToken = false
    };
    
    return new Client(
        builder.Configuration["Supabase:Url"]!,
        builder.Configuration["Supabase:Key"]!,
        options
    );
});

// Explicitly add logging services
builder.Services.AddLogging();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.MapAccountEndpoints();
app.MapAuthEndpoints();
app.MapBudgetEndpoints();
app.MapCategoryEndpoints();
app.MapGoalEndpoints();
app.MapHouseholdEndpoints();
app.MapPrivacyEndpoints();
app.MapProfileEndpoints();
app.MapTransactionEndpoints();
app.MapSharedExpenseEndpoints();

app.UseHttpsRedirection();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Starting API in {Environment}", app.Environment.EnvironmentName);

app.Run("http://localhost:5043");