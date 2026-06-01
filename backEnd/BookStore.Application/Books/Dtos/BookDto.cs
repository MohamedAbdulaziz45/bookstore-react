namespace BookStore.Application.Books.Dtos;

public class BookDto
{
    public int BookId { get; set; } = default;
    public string Title { get; set; } = default!;
    public string ISBN { get; set; } = default!;
    public DateTime PublicationDate { get; set; } = default;
    public string? AdditionalDetails { get; set; } = default;
    public decimal Price { get; set; } = default;
    public int QuantityInStock { get; set; } = default;
    public int GenreId { get; set; } = default;
    public int ImageId { get; set; } = default;
}
