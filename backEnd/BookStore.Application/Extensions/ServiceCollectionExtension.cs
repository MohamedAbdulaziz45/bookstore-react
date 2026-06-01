using BookStore.Application.Common.Behaviors;
using BookStore.Application.Services.CartService;
using BookStore.Application.Users;
using FluentValidation;

using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace BookStore.Application.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddApplication(this IServiceCollection services)
    {
        var applicationAssembly = typeof(ServiceCollectionExtension).Assembly;
        
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(applicationAssembly));

        services.AddAutoMapper(cfg => { }, applicationAssembly);

        services.AddValidatorsFromAssembly(applicationAssembly);
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddScoped<IUserContext, UserContext>();
        services.AddScoped<ICartService, CartService>();
        services.AddHttpContextAccessor();

    }
}
