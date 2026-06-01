using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class CheckoutIntentItemConfig : IEntityTypeConfiguration<CheckoutIntentItem>
{
    public void Configure(EntityTypeBuilder<CheckoutIntentItem> builder)
    {
        builder.HasKey(i => i.CheckoutIntentItemId);

        builder.Property(i => i.UnitPrice).HasColumnType("decimal(18,2)");
        builder.Property(i => i.TotalPrice).HasColumnType("decimal(18,2)");
        builder.Property(i => i.BookTitle).IsRequired().HasMaxLength(255);

        builder.HasOne(i => i.CheckoutIntent)
            .WithMany(c => c.Items)
            .HasForeignKey(i => i.CheckoutIntentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Book)
            .WithMany()
            .HasForeignKey(i => i.BookId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}