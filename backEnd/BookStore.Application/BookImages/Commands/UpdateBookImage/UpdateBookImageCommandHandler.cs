using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.BookImages.Commands.UpdateBookImage;

internal class UpdateBookImageCommandHandler(ILogger<UpdateBookImageCommandHandler> logger, IMapper mapper, IBookImagesRepository repository) : IRequestHandler<UpdateBookImageCommand, bool>
{
    public async Task<bool> Handle(UpdateBookImageCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Updating BookImage {request.ImageId}");
        
        var existingEntity = await repository.GetByIdAsync(request.ImageId);
        if (existingEntity == null)
            throw new NotFoundException(nameof(BookImage), request.ImageId.ToString());

        mapper.Map(request, existingEntity);
        return await repository.UpdateAsync(existingEntity);
    }
}
