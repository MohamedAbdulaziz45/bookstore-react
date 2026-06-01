using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class CheckoutIntentConfig : IEntityTypeConfiguration<CheckoutIntent>
{
    public void Configure(EntityTypeBuilder<CheckoutIntent> builder)
    {
        builder.HasKey(c => c.CheckoutIntentId);

        builder.Property(c => c.Status).HasConversion<int>();
        builder.Property(c => c.TotalAmount).HasColumnType("decimal(18,2)");
        builder.Property(c => c.Currency).IsRequired().HasMaxLength(3);
        builder.Property(c => c.StripeSessionId).HasMaxLength(255);
        builder.Property(c => c.StripeCustomerId).HasMaxLength(255);
        builder.Property(c => c.FailureReason).HasMaxLength(1000);

        builder.OwnsOne(o => o.ShippingAddress, address =>
        {
            address.Property(a => a.RecipientName).HasMaxLength(150);
            address.Property(a => a.RecipientPhone).HasMaxLength(30);
            address.Property(a => a.AddressLine1).HasMaxLength(250);
            address.Property(a => a.AddressLine2).HasMaxLength(250);
            address.Property(c => c.City).IsRequired().HasMaxLength(100);
            address.Property(c => c.State).HasMaxLength(100);
            address.Property(c => c.PostalCode).IsRequired().HasMaxLength(20);
            address.Property(c => c.Country).IsRequired().HasMaxLength(2);
        });
        builder.HasIndex(c => c.StripeSessionId)
            .IsUnique()
            .HasFilter("[StripeSessionId] IS NOT NULL");

        builder.HasOne(c => c.Customer)
            .WithMany(cu => cu.CheckoutIntents)
            .HasForeignKey(c => c.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.SavedAddress)
            .WithMany()
            .HasForeignKey(c => c.SavedAddressId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}