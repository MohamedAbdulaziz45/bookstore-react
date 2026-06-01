using MediatR;

namespace BookStore.Application.Books.Commands.DeleteBook;

public class DeleteBookCommand(int id) : IRequest<bool>
{
    public int BookId { get; } = id;
}
