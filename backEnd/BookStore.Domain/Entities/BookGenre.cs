
namespace BookStore.Domain.Entities;

public class BookGenre
{
    public int BookGenreId { get; set; }
    public int BookId { get; set; }
    public Book Book { get; set; } = default!;

    public int GenreId { get; set; }
    public Category Genre { get; set; } = default!;
}
