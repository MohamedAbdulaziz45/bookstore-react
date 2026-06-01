using AutoMapper;
using BookStore.Application.Genres.Dtos;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Genres.Queries.GetGenreById;

internal class GetGenreByIdQueryHandler(ILogger<GetGenreByIdQueryHandler> logger, IMapper mapper, IGenresRepository repository) : IRequestHandler<GetGenreByIdQuery, GenreDto>
{
    public async Task<GenreDto> Handle(GetGenreByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Getting Genre {request.GenreId}");
        var entity = await repository.GetByIdAsync(request.GenreId);
        
        if (entity == null)
            throw new NotFoundException(nameof(Category), request.GenreId.ToString());
            
        return mapper.Map<GenreDto>(entity);
    }
}
