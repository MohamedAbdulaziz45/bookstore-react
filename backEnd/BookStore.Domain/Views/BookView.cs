namespace BookStore.Domain.Views;

public class BookView
{
    public int Id { get; set; }
    public DateTime PublicationDate { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime? FeaturedAt { get; set; }
    public bool IsEditorsPick { get; set; }
    public DateTime? EditorsPickAt { get; set; }
    public string Title { get; set; } = default!;
    public decimal Price { get; set; }
    public string? Image { get; set; }
    public string Author { get; set; } = default!;
    public int AuthorId { get; set; }
    public string? Description { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public string? CategoriesJson { get; set; }  
}
