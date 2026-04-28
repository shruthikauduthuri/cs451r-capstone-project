using api.Endpoints;
using Supabase;
using Serilog;

// Configure Serilog for file logging
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("System", Serilog.Events.LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(
        path: "logs/api-.log",
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
    )
    .CreateLogger();

try
{
    Log.Information("Starting Orion API");

    var builder = WebApplication.CreateBuilder(args);

    // Use Serilog for logging
    builder.Host.UseSerilog();

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

    var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    // Add Serilog request logging
    app.UseSerilogRequestLogging();

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

    Log.Information("API starting on http://localhost:5043");

    app.Run("http://localhost:5043");
}
catch (Exception ex)
{
    Log.Fatal(ex, "API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}