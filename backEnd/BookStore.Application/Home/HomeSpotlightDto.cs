using BookStore.Application.Authors.Dtos;
using BookStore.Application.Books.Dtos;

namespace BookStore.Application.Home;

public class HomeSpotlightDto
{
    public MiniBookDto FeaturedBook { get; set; } = default!;
    public AuthorDto FeaturedAuthor { get; set; } = default!;
    public bool IsFeaturedBookFallback { get; set; }
    public bool IsFeaturedAuthorFallback { get; set; }
}
