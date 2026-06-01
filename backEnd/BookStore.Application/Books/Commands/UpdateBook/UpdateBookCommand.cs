using MediatR;
using Microsoft.AspNetCore.Http;

namespace BookStore.Application.Books.Commands.UpdateBook;

public class UpdateBookCommand : IRequest<bool>
{
    public int BookId { get; set; } = default;
    public string Title { get; set; } = default!;
    public string ISBN { get; set; } = default!;
    public DateTime PublicationDate { get; set; } = default;
    public string? AdditionalDetails { get; set; } = default;
    public decimal Price { get; set; } = default;
    public int QuantityInStock { get; set; } = default;
    public int AuthorId { get; set; } = default;
    public List<int> GenreIds { get; set; } = [];
    public bool IsFeatured { get; set; }
    public bool IsEditorsPick { get; set; }
    public IFormFile? Image { get; set; }
}
