using BookStore.Application.Common.Interface;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Authors.Commands.UpdateAuthor;

internal class UpdateAuthorCommandHandler(
ILogger<UpdateAuthorCommandHandler> logger,
IAuthorsRepository repository,
ICloudinaryService cloudinaryService) 
: IRequestHandler<UpdateAuthorCommand, bool>
{
    public async Task<bool> Handle(UpdateAuthorCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Updating Author {request.AuthorId}");
        
        var existingEntity = await repository.GetByIdAsync(request.AuthorId);
        if (existingEntity == null)
            throw new NotFoundException(nameof(Author), request.AuthorId.ToString());

        var oldPublicId = existingEntity.ImagePublicId;
        var uploadResult = request.ImageFile is not null
            ? await cloudinaryService.UploadImageAsync(request.ImageFile, "bookworms/authors")
            : null;

        existingEntity.Name = request.Name;
        existingEntity.Bio = request.Bio;
        existingEntity.Image = uploadResult?.Url ?? request.Image ?? existingEntity.Image;
        existingEntity.ImagePublicId = uploadResult?.PublicId ?? existingEntity.ImagePublicId;

        if (existingEntity.IsFeatured != request.IsFeatured)
        {
            existingEntity.FeaturedAt = request.IsFeatured ? DateTime.UtcNow : null;
        }
        existingEntity.IsFeatured = request.IsFeatured;

        try
        {
            var updated = await repository.UpdateAsync(existingEntity);
            if (updated && uploadResult is not null && !string.IsNullOrWhiteSpace(oldPublicId))
            {
                await cloudinaryService.DeleteImageAsync(oldPublicId);
            }

            return updated;
        }
        catch
        {
            if (uploadResult is not null)
            {
                await cloudinaryService.DeleteImageAsync(uploadResult.PublicId);
            }

            throw;
        }
    }
}
