using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Authors.Commands.DeleteAuthor;

internal class DeleteAuthorCommandHandler(ILogger<DeleteAuthorCommandHandler> logger, IAuthorsRepository repository) : IRequestHandler<DeleteAuthorCommand, bool>
{
    public async Task<bool> Handle(DeleteAuthorCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Deleting Author {request.AuthorId}");

        var isDeleted = await repository.DeleteAsync(request.AuthorId);
        if (!isDeleted)
            throw new NotFoundException(nameof(Author), request.AuthorId.ToString());

        return isDeleted;
    }
}
