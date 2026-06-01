using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Genres.Commands.UpdateGenre;

internal class UpdateGenreCommandHandler(ILogger<UpdateGenreCommandHandler> logger, IMapper mapper, IGenresRepository repository) : IRequestHandler<UpdateGenreCommand, bool>
{
    public async Task<bool> Handle(UpdateGenreCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Updating Genre {request.GenreId}");
        
        var existingEntity = await repository.GetByIdAsync(request.GenreId);
        if (existingEntity == null)
            throw new NotFoundException(nameof(Category), request.GenreId.ToString());

        mapper.Map(request, existingEntity);
        return await repository.UpdateAsync(existingEntity);
    }
}
