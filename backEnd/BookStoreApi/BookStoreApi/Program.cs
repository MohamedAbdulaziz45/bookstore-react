using BookStore.Application.Extensions;
using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Infrastructure.Extensions;
using BookStore.Infrastructure.Seeders;
using BookStoreApi.Extensions;
using BookStoreApi.Middlewares;

namespace BookStoreApi;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.AddPresentation();
        builder.Services.AddApplication();
        builder.Services.AddInfrastructure(builder.Configuration);

        builder.Services.AddScoped<ErrorHandlingMiddleware>();
        builder.Services.AddScoped<RateLimitingMiddleware>();
        builder.Services.AddScoped<RequestTimeLoggingMiddleware>();

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        var app = builder.Build();

        // Run Seeder
        using (var scope = app.Services.CreateScope())
        {
            var seeder = scope.ServiceProvider.GetRequiredService<IBookStoreSeeder>();
            await seeder.Seed();
        }

        app.UseMiddleware<ErrorHandlingMiddleware>();

        app.UseMiddleware<RequestTimeLoggingMiddleware>();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors("AllowAngular");
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseMiddleware<RateLimitingMiddleware>();
        app.MapGroup("api/identity")
            .WithTags("Identity")
            .MapIdentityApi<User>()
            .RequireAuthorization(policy => policy.RequireRole(UserRoles.Admin));

        app.MapControllers();

        app.Run();
    }
}
