
using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Persistence.Config;

public class BookGenreConfig : IEntityTypeConfiguration<BookGenre>
{
    public void Configure(EntityTypeBuilder<BookGenre> builder)
    {
        builder.HasKey(bg => bg.BookGenreId);

        builder.HasOne(bg => bg.Book)
               .WithMany(b => b.BookGenres)
               .HasForeignKey(bg => bg.BookId)
               .OnDelete(DeleteBehavior.Cascade); 
      
               builder.HasOne(bg => bg.Genre)
               .WithMany(g => g.BookGenres)
               .HasForeignKey(bg => bg.GenreId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
