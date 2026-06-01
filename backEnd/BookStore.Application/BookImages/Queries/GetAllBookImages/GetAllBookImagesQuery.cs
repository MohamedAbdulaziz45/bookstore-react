using BookStore.Application.BookImages.Dtos;
using MediatR;
using System.Collections.Generic;

namespace BookStore.Application.BookImages.Queries.GetAllBookImages;

public class GetAllBookImagesQuery : IRequest<IEnumerable<BookImageDto>>
{
}
