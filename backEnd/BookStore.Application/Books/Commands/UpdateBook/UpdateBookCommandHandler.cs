using BookStore.Application.Common.Interface;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Books.Commands.UpdateBook;

internal class UpdateBookCommandHandler(
    ILogger<UpdateBookCommandHandler> logger,
    IBooksRepository repository,
    ICloudinaryService cloudinaryService) : IRequestHandler<UpdateBookCommand, bool>
{
    public async Task<bool> Handle(UpdateBookCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Updating Book {request.BookId}");
        
        var existingEntity = await repository.GetByIdAsync(request.BookId);
        if (existingEntity == null)
            throw new NotFoundException(nameof(Book), request.BookId.ToString());

        var oldPublicId = existingEntity.BookImage?.PublicId;
        var uploadResult = request.Image is not null
            ? await cloudinaryService.UploadImageAsync(request.Image)
            : null;

        existingEntity.Title = request.Title;
        existingEntity.ISBN = request.ISBN;
        existingEntity.PublicationDate = request.PublicationDate;
        existingEntity.AdditionalDetails = request.AdditionalDetails;
        existingEntity.Price = request.Price;
        existingEntity.QuantityInStock = request.QuantityInStock;
        existingEntity.AuthorId = request.AuthorId;

        if (existingEntity.IsFeatured != request.IsFeatured)
        {
            existingEntity.FeaturedAt = request.IsFeatured ? DateTime.UtcNow : null;
        }
        existingEntity.IsFeatured = request.IsFeatured;

        if (existingEntity.IsEditorsPick != request.IsEditorsPick)
        {
            existingEntity.EditorsPickAt = request.IsEditorsPick ? DateTime.UtcNow : null;
        }
        existingEntity.IsEditorsPick = request.IsEditorsPick;

        existingEntity.BookGenres.Clear();
        foreach (var genreId in request.GenreIds.Distinct())
        {
            existingEntity.BookGenres.Add(new BookGenre
            {
                BookId = existingEntity.BookId,
                GenreId = genreId
            });
        }

        if (uploadResult is not null)
        {
            if (existingEntity.BookImage is null)
            {
                existingEntity.BookImage = new BookImage();
            }

            existingEntity.BookImage.ImageURL = uploadResult.Url;
            existingEntity.BookImage.PublicId = uploadResult.PublicId;
        }

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
