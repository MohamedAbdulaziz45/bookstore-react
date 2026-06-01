using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class BookConfig : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.HasKey(b => b.BookId);

        builder.Property(b => b.Title)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(b => b.ISBN)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(b => b.Price)
            .HasColumnType("decimal(18,2)");
   
      
        builder.Property(b => b.IsFeatured).IsRequired().HasDefaultValue(false);
        builder.Property(b => b.FeaturedAt).IsRequired(false);
        builder.Property(b => b.IsEditorsPick).IsRequired().HasDefaultValue(false);
        builder.Property(b => b.EditorsPickAt).IsRequired(false);
     
        
        builder.HasOne(b => b.BookImage)
            .WithOne(bi => bi.Book)
            .HasForeignKey<Book>(bi => bi.ImageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
