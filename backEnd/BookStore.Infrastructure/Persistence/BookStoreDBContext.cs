using BookStore.Domain.Entities;
using BookStore.Domain.Views;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Persistence;

public class BookStoreDBContext(DbContextOptions<BookStoreDBContext> options) : IdentityDbContext<User>(options)
{
    internal DbSet<Person> People { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Category> Genres { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<BookImage> BookImages { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Shipping> Shippings { get; set; }

    public DbSet<Author> Authors { get; set; }

    public DbSet<BookGenre> BookGenres { get; set; }
    public DbSet<BookView> BookViews { get; set; }
    public DbSet<ReviewView> ReviewsViews { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<ProcessedWebhookEvent> ProcessedWebhookEvents { get; set; }
    public DbSet<CheckoutIntent> CheckoutIntents { get; set; }
    public DbSet<CheckoutIntentItem> CheckoutIntentItems { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<NewsletterSubscription> NewsletterSubscriptions { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BookStoreDBContext).Assembly);
       
        modelBuilder.Entity<BookView>(entity =>
        {
            entity.HasNoKey();
            entity.ToView("vw_Books");
            entity.Property(b => b.Rating).HasPrecision(3, 2);
            entity.Property(b => b.Price).HasPrecision(18, 2);
        });
        modelBuilder.Entity<ReviewView>(entity =>
        {
            entity.HasNoKey();
            entity.ToView("vw_Reviews");
        });
    }
}
