using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.BookImages.Commands.DeleteBookImage;

internal class DeleteBookImageCommandHandler(ILogger<DeleteBookImageCommandHandler> logger, IBookImagesRepository repository) : IRequestHandler<DeleteBookImageCommand, bool>
{
    public async Task<bool> Handle(DeleteBookImageCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Deleting BookImage {request.ImageId}");
        
        var existingEntity = await repository.GetByIdAsync(request.ImageId);
        if (existingEntity == null)
            throw new NotFoundException(nameof(BookImage), request.ImageId.ToString());

        return await repository.DeleteAsync(request.ImageId);
    }
}
