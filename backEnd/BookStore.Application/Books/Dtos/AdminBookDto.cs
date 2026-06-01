namespace BookStore.Application.Books.Dtos;

public class AdminBookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string ISBN { get; set; } = default!;
    public string Author { get; set; } = default!;
    public int AuthorId { get; set; }
    public IEnumerable<CategoryDto> Genres { get; set; } = [];
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public DateTime PublicationDate { get; set; }
    public string? AdditionalDetails { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime? FeaturedAt { get; set; }
    public bool IsEditorsPick { get; set; }
    public DateTime? EditorsPickAt { get; set; }
}
