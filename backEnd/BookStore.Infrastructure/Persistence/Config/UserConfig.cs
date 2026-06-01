using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class UserConfig : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        
        builder.Property(x => x.DisplayName)
        .HasColumnType("nvarchar")
        .HasMaxLength(50)
        .IsRequired(false);

        builder.HasIndex(x => x.DisplayName)
        .IsUnique();
        
        builder.Property(x => x.FirstName)
            .HasColumnType("nvarchar")
            .HasMaxLength(50)
            .IsRequired(false);

        builder.Property(x => x.LastName)
            .HasColumnType("nvarchar")
            .HasMaxLength(50)
            .IsRequired(false);

        builder.Property(x => x.Address)
            .HasColumnType("nvarchar")
            .HasMaxLength(255)
            .IsRequired(false);
      
            builder.Property(u => u.ImagePath)
            .HasMaxLength(500)
            .IsRequired(false);

        builder.Property(u => u.PublicId)
            .HasMaxLength(500)
            .IsRequired(false);
    }
}
