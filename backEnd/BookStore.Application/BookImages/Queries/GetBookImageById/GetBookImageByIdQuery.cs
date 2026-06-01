using BookStore.Application.BookImages.Dtos;
using MediatR;

namespace BookStore.Application.BookImages.Queries.GetBookImageById;

public class GetBookImageByIdQuery(int id) : IRequest<BookImageDto>
{
    public int ImageId { get; } = id;
}
