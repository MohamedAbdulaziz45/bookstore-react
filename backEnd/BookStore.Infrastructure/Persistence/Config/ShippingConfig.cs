using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class ShippingConfig : IEntityTypeConfiguration<Shipping>
{
    public void Configure(EntityTypeBuilder<Shipping> builder)
    {
        builder.HasKey(s => s.ShippingId);

        builder.Property(s => s.CarrierName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(s => s.TrackingNumber)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(s => s.ShippingStatus).HasConversion<int>();

        builder.HasOne(s => s.Order)
            .WithOne(o => o.Shipping)
            .HasForeignKey<Shipping>(s => s.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
