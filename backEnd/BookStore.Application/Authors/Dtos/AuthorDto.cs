namespace BookStore.Application.Authors.Dtos;

public class AuthorDto
{
    public int AuthorId { get; set; } 
    public string Name { get; set; } = default!;
    public string Bio { get; set; } = default!;
    public string? Image { get; set; }
    public string? ImagePublicId { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime? FeaturedAt { get; set; }
    public int BooksCount { get; set; }
}
