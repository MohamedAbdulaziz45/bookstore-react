using BookStore.Application.Genres.Dtos;
using MediatR;
using System.Collections.Generic;

namespace BookStore.Application.Genres.Queries.GetAllGenres;

public class GetAllGenresQuery : IRequest<IEnumerable<GenreDto>>
{
}
