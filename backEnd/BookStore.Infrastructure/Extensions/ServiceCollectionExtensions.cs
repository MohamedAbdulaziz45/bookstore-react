using BookStore.Application.Common.Interface;
using BookStore.Application.Common.Settings;
using BookStore.Application.Services.PaymentService.CheckoutFulfillment;
using BookStore.Application.Services.PaymentService.Stripe;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Identity;
using BookStore.Infrastructure.Identity.Authentication;
using BookStore.Infrastructure.Persistence;
using BookStore.Infrastructure.Repositories;
using BookStore.Infrastructure.Seeders;
using BookStore.Infrastructure.Services;
using BookStore.Infrastructure.Services.Payment.CheckoutFulfillment;
using BookStore.Infrastructure.Services.Payment.Stripe;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BookStore.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Add DbContext when the DB Context is ready
        var connectionString = configuration.GetConnectionString("BookStoreDb");
        services.AddDbContext<BookStoreDBContext>(options => options.UseSqlServer(connectionString));

        services.AddIdentityApiEndpoints<User>()
        .AddRoles<IdentityRole>()
        .AddEntityFrameworkStores<BookStoreDBContext>();

        services.AddScoped<IPeopleRepository, PeopleRepository>();
        services.AddScoped<IBooksRepository, BooksRepository>();
        services.AddScoped<IBookImagesRepository, BookImagesRepository>();
        services.AddScoped<ICustomersRepository, CustomersRepository>();
        services.AddScoped<IGenresRepository, GenresRepository>();
        services.AddScoped<IOrdersRepository, OrdersRepository>();
        services.AddScoped<IOrderItemsRepository, OrderItemsRepository>();
        services.AddScoped<IPaymentsRepository, PaymentsRepository>();
        services.AddScoped<IReviewsRepository, ReviewsRepository>();
        services.AddScoped<IShippingsRepository, ShippingsRepository>();
        services.AddScoped<IAuthorsRepository, AuthorsRepository>();
        services.AddScoped<IBookStoreSeeder, BookStoreSeeder>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.Configure<CloudinarySettings>(configuration.GetSection("CloudinarySettings"));
        services.AddScoped<ICloudinaryService, CloudinaryService>();
        services.AddScoped<ICartsRepository, CartsRepository>();
        services.AddScoped<IAddressesRepository, AddressesRepository>();
        services.AddScoped<ICheckoutIntentsRepository, CheckoutIntentsRepository>();
        services.Configure<StripeSettings>(configuration.GetSection("Stripe"));
        services.AddScoped<IStripeService, StripeService>();
        services.AddScoped<ICheckoutFulfillmentService, CheckoutFulfillmentService>();
        services.AddScoped<INotificationsRepository, NotificationsRepository>();
        services.AddScoped<INewsletterSubscriptionsRepository, NewsletterSubscriptionsRepository>();
    }
}
