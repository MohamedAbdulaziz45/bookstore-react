using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.BookImages.Commands.CreateBookImage;

internal class CreateBookImageCommandHandler(ILogger<CreateBookImageCommandHandler> logger, IMapper mapper, IBookImagesRepository repository) : IRequestHandler<CreateBookImageCommand, int>
{
    public async Task<int> Handle(CreateBookImageCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating a new BookImage");
        var entity = mapper.Map<BookImage>(request);
        var id = await repository.CreateAsync(entity);
        return id;
    }
}
