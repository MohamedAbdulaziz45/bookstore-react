using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Authors.Commands.FeatureAuthor;

internal class FeatureAuthorCommandHandler
(ILogger<FeatureAuthorCommandHandler> logger,
IAuthorsRepository authorsRepository)
: IRequestHandler<FeatureAuthorCommand>
{
    public async Task Handle(FeatureAuthorCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Featuring an author with id = {AuthorId}", request.AuthorId);
        var author = await authorsRepository.GetByIdAsync(request.AuthorId)
             ?? throw new NotFoundException(nameof(Author), request.AuthorId.ToString());

        if (author.IsFeatured)
            throw new BadRequestException("Author is already featured.");

        author.IsFeatured = true;
        author.FeaturedAt = DateTime.UtcNow;
        await authorsRepository.UpdateAsync(author);
    }
}
