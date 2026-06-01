using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class NewsletterSubscriptionConfig : IEntityTypeConfiguration<NewsletterSubscription>
{
    public void Configure(EntityTypeBuilder<NewsletterSubscription> builder)
    {
        builder.HasKey(n => n.NewsletterSubscriptionId);

        builder.Property(n => n.Email)
            .IsRequired()
            .HasMaxLength(320);

        builder.HasIndex(n => n.Email)
            .IsUnique();

        builder.Property(n => n.IsActive)
            .HasDefaultValue(true);

        builder.HasOne(n => n.Customer)
            .WithMany(c => c.NewsletterSubscriptions)
            .HasForeignKey(n => n.CustomerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
