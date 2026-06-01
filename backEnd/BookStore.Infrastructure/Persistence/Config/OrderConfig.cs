using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class OrderConfig : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {

        builder.HasKey(o => o.OrderId);

        builder.Property(o => o.TotalAmount)
            .HasColumnType("decimal(18,2)");

        builder.HasOne(o => o.Customer)
            .WithMany(c => c.Orders)
            .HasForeignKey(o => o.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.Property(o => o.Status).HasConversion<int>();
        builder.Property(o => o.StripeSessionId).HasMaxLength(255);
        builder.HasIndex(o => o.StripeSessionId)
        .IsUnique()
        .HasFilter("[StripeSessionId] IS NOT NULL");


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


        builder.HasOne(c => c.SavedAddress)
            .WithMany()
            .HasForeignKey(c => c.SavedAddressId)
            .OnDelete(DeleteBehavior.SetNull);
    }

}
