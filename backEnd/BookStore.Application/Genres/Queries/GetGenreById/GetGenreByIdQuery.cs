using BookStore.Application.Genres.Dtos;
using MediatR;

namespace BookStore.Application.Genres.Queries.GetGenreById;

public class GetGenreByIdQuery(int id) : IRequest<GenreDto>
{
    public int GenreId { get; } = id;
}
