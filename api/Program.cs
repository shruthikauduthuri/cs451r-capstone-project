using api.Contracts;
using api.Models;
using Supabase;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.Swagger;

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

app.MapPost("/users", async (Client supabase, CreateUserRequest request) =>
{
    var response = await supabase.From<User>().Insert(new User
    {
        Name = request.Name,
        Email = request.Email
    });

    var createdUser = response.Models.FirstOrDefault();
    if (createdUser == null)
    {
        return Results.Problem("Failed to create user.");
    }

    return Results.Ok(createdUser.Id);
});

app.MapGet("/users/{id}", async (Client supabase, long id) =>
{
    var response = await supabase.From<User>().Where(u => u.Id == id).Get();
    var user = response.Models.FirstOrDefault();

    if (user is null)
    {
        return Results.NotFound();
    }

    var userResponse = new CreateUserResponse
    {
        Id = user.Id,
        Name = user.Name,
        Email = user.Email,
        Created_at = user.Created_at
    };
    return Results.Ok(userResponse);
});

app.MapDelete("/users/{id}", async (Client supabase, long id) =>
{
    await supabase.From<User>().Where(u => u.Id == id).Delete();
    return Results.NoContent();
});

app.UseHttpsRedirection();



app.Run();