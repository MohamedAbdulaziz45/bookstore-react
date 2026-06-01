using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.HasKey(c => c.CartId);

        builder.HasOne(c => c.Customer)
               .WithOne(cu => cu.Cart)
               .HasForeignKey<Cart>(c => c.CustomerId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(c => c.CartItems)
               .WithOne(ci => ci.Cart)
               .HasForeignKey(ci => ci.CartId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => c.CustomerId)
               .IsUnique();
    }
}
