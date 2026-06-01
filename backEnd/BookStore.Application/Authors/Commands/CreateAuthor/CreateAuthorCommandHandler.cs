
using BookStore.Application.Common.Interface;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Authors.Commands.CreateAuthor;

internal class CreateAuthorCommandHandler(
ILogger<CreateAuthorCommandHandler> logger, 
IAuthorsRepository repository,
ICloudinaryService cloudinaryService)
: IRequestHandler<CreateAuthorCommand, int>
{
    public async Task<int> Handle(CreateAuthorCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating a new Author");
        var uploadResult = request.ImageFile is not null
            ? await cloudinaryService.UploadImageAsync(request.ImageFile, "bookworms/authors")
            : null;

        var entity = new Author
        {
            Name = request.Name,
            Bio = request.Bio,
            Image = uploadResult?.Url ?? request.Image,
            ImagePublicId = uploadResult?.PublicId,
            IsFeatured = request.IsFeatured,
            FeaturedAt = request.IsFeatured ? DateTime.UtcNow : null
        };

        try
        {
            return await repository.Create(entity);
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
