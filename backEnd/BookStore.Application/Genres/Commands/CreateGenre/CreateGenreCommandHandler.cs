using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Genres.Commands.CreateGenre;

internal class CreateGenreCommandHandler(ILogger<CreateGenreCommandHandler> logger, IMapper mapper, IGenresRepository repository) : IRequestHandler<CreateGenreCommand, int>
{
    public async Task<int> Handle(CreateGenreCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating a new Genre");
        var entity = mapper.Map<Category>(request);
        var id = await repository.CreateAsync(entity);
        return id;
    }
}
