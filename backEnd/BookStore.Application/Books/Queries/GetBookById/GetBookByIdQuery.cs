using BookStore.Application.Books.Dtos;
using MediatR;

namespace BookStore.Application.Books.Queries.GetBookById;

public class GetBookByIdQuery(int id) : IRequest<BookViewDto>
{
    public int BookId { get; } = id;
}
