

namespace BookStore.Application.Books.Dtos;

public class MiniBookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public decimal Price { get; set; }
    public string? Image { get; set; }
    public string Author { get; set; } = default!;
    public int AuthorId { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
}
