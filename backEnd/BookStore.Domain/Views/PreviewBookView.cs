
namespace BookStore.Domain.Views;
public record PreviewBookView(
int BookId,
string Title,
decimal Price,
int QuantityInStock,
string?BookImage);