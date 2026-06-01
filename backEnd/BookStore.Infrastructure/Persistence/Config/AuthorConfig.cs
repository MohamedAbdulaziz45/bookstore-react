using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class AuthorConfig : IEntityTypeConfiguration<Author>
{
    public void Configure(EntityTypeBuilder<Author> builder)
    {
        builder.HasKey(a => a.AuthorId);

        builder.Property(a => a.Name)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(a => a.Bio)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(a => a.Image)
            .HasMaxLength(500);

        builder.Property(a => a.ImagePublicId)
            .HasMaxLength(500)
            .IsRequired(false);

        builder.Property(a => a.IsFeatured).IsRequired().HasDefaultValue(false);
        builder.Property(a => a.FeaturedAt).IsRequired(false);

        builder.HasMany(a => a.Books)
            .WithOne(b => b.Author)
            .HasForeignKey(b => b.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
