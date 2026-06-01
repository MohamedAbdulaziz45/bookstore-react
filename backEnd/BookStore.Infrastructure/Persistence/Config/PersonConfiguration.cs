using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

internal class PersonConfiguration : IEntityTypeConfiguration<Person>
{
    public void Configure(EntityTypeBuilder<Person> builder)
    {

        builder.HasKey(x => x.PersonId);
        // Identity column (auto-increment in SQL)
        builder.Property(x => x.PersonId).ValueGeneratedOnAdd();

        // Required string properties with max length
        builder.Property(x => x.NationalNo)
            .HasColumnType("nvarchar")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(x => x.FirstName)
            .HasColumnType("nvarchar")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(x => x.SecondName)
            .HasColumnType("nvarchar")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(x => x.ThirdName)
            .HasColumnType("nvarchar")
            .HasMaxLength(20)
            .IsRequired(false); // Nullable

        builder.Property(x => x.LastName)
            .HasColumnType("nvarchar")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(x => x.DateOfBirth)
            .HasColumnType("datetime")
            .IsRequired();

        builder.Property(x => x.Gender)
            .HasColumnType("tinyint")
            .IsRequired();

        builder.Property(x => x.Address)
            .HasColumnType("nvarchar")
            .HasMaxLength(500)
            .IsRequired();

  

        builder.Property(x => x.ImagePath)
            .HasColumnType("nvarchar")
            .HasMaxLength(250)
            .IsRequired(false); // Nullable

        // Table name
        builder.ToTable("People");
    }
}
