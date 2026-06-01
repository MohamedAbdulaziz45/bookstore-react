namespace BookStore.Application.Authors.Dtos;

public class FeaturedAuthorDto
{
    public AuthorDto Author { get; set; } = default!;
    public bool IsFallback { get; set; }
}
