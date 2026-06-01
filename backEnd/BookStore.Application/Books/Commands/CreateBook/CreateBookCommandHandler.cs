using BookStore.Application.Common.Interface;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Books.Commands.CreateBook;

internal class CreateBookCommandHandler(
    ILogger<CreateBookCommandHandler> logger,
    IBooksRepository repository,
    ICloudinaryService cloudinaryService) : IRequestHandler<CreateBookCommand, int>
{
    public async Task<int> Handle(CreateBookCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating a new Book");
        var uploadResult = request.Image is not null
            ? await cloudinaryService.UploadImageAsync(request.Image)
            : null;

        var entity = new Book
        {
            Title = request.Title,
            ISBN = request.ISBN,
            PublicationDate = request.PublicationDate,
            AdditionalDetails = request.AdditionalDetails,
            Price = request.Price,
            QuantityInStock = request.QuantityInStock,
            AuthorId = request.AuthorId,
            IsFeatured = request.IsFeatured,
            FeaturedAt = request.IsFeatured ? DateTime.UtcNow : null,
            IsEditorsPick = request.IsEditorsPick,
            EditorsPickAt = request.IsEditorsPick ? DateTime.UtcNow : null,
            BookGenres = request.GenreIds.Distinct().Select(genreId => new BookGenre
            {
                GenreId = genreId
            }).ToList(),
            BookImage = uploadResult is null
                ? null
                : new BookImage
                {
                    ImageURL = uploadResult.Url,
                    PublicId = uploadResult.PublicId
                }
        };

        try
        {
            return await repository.CreateAsync(entity);
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
