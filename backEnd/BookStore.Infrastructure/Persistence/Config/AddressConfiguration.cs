using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.HasKey(a => a.AddressId);

        builder.Property(a => a.Label).IsRequired().HasMaxLength(50);
        builder.Property(a => a.FullName).IsRequired().HasMaxLength(150);
        builder.Property(a => a.Phone).IsRequired().HasMaxLength(30);
        builder.Property(a => a.AddressLine1).IsRequired().HasMaxLength(250);
        builder.Property(a => a.AddressLine2).HasMaxLength(250);
        builder.Property(a => a.City).IsRequired().HasMaxLength(100);
        builder.Property(a => a.State).HasMaxLength(100);
        builder.Property(a => a.PostalCode).IsRequired().HasMaxLength(20);
        builder.Property(a => a.Country).IsRequired().HasMaxLength(2);

        builder.HasOne(a => a.Customer)
            .WithMany(c => c.Addresses)
            .HasForeignKey(a => a.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(a => new { a.CustomerId, a.IsDefault })
            .HasFilter("[IsDefault] = 1")
            .IsUnique();
    }
}
