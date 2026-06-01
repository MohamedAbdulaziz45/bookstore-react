using System.Collections.Generic;

namespace BookStore.Domain.Entities;

public class Category
{
    public int GenreId { get; set; }
    public string GenreName { get; set; } = default!;

    public string? ImgUrl { get; set; }


    public ICollection<BookGenre> BookGenres { get; set; } = new List<BookGenre>();
}
