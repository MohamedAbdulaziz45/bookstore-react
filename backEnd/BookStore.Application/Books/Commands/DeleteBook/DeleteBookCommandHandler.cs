using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Books.Commands.DeleteBook;

internal class DeleteBookCommandHandler(ILogger<DeleteBookCommandHandler> logger, IBooksRepository repository) : IRequestHandler<DeleteBookCommand, bool>
{
    public async Task<bool> Handle(DeleteBookCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Deleting Book {request.BookId}");
        
        var existingEntity = await repository.GetByIdAsync(request.BookId);
        if (existingEntity == null)
            throw new NotFoundException(nameof(Book), request.BookId.ToString());

        return await repository.DeleteAsync(request.BookId);
    }
}
