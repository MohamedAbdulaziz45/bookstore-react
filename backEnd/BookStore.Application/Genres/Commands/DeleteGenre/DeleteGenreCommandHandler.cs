using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Genres.Commands.DeleteGenre;

internal class DeleteGenreCommandHandler(ILogger<DeleteGenreCommandHandler> logger, IGenresRepository repository) : IRequestHandler<DeleteGenreCommand, bool>
{
    public async Task<bool> Handle(DeleteGenreCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Deleting Genre {request.GenreId}");
        
        var existingEntity = await repository.GetByIdAsync(request.GenreId);
        if (existingEntity == null)
            throw new NotFoundException(nameof(Category), request.GenreId.ToString());

        return await repository.DeleteAsync(request.GenreId);
    }
}
