using AutoMapper;
using BookStore.Application.Genres.Dtos;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace BookStore.Application.Genres.Queries.GetAllGenres;

internal class GetAllGenresQueryHandler(ILogger<GetAllGenresQueryHandler> logger, IMapper mapper, IGenresRepository repository) : IRequestHandler<GetAllGenresQuery, IEnumerable<GenreDto>>
{
    public async Task<IEnumerable<GenreDto>> Handle(GetAllGenresQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all Genres");
        var entities = await repository.GetAllGenresAndCountAsync();
        return mapper.Map<IEnumerable<GenreDto>>(entities);
    }
}
