using BookStore.Application.Authors.Commands.FeatureAuthor;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Authors.Commands.UnfeatureAuthor;

public class UnfeatureAuthorCommandHandler(
IAuthorsRepository authorsRepository,
ILogger<UnfeatureAuthorCommandHandler> logger
)
    : IRequestHandler<UnfeatureAuthorCommand>
{
    public async Task Handle(UnfeatureAuthorCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Unfeaturing an author with id = {AuthorId}", request.AuthorId);
        var author = await authorsRepository.GetByIdAsync(request.AuthorId)
           ?? throw new NotFoundException(nameof(Author), request.AuthorId.ToString());

        if (!author.IsFeatured)
            throw new BadRequestException("Author is not featured.");

        author.IsFeatured = false;
        author.FeaturedAt = null;
        await authorsRepository.UpdateAsync(author);
    }
}
