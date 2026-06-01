using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class BookImageConfig : IEntityTypeConfiguration<BookImage>
{
    public void Configure(EntityTypeBuilder<BookImage> builder)
    {
        builder.HasKey(bi => bi.ImageId);

        builder.Property(bi => bi.ImageURL)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(bi => bi.PublicId)
            .HasMaxLength(500)
            .IsRequired(false);
    }
}
