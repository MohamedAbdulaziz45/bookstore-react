using AutoMapper;
using BookStore.Application.Books.Dtos;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Books.Queries.GetBookById;

internal class GetBookByIdQueryHandler(ILogger<GetBookByIdQueryHandler> logger, IMapper mapper, IBooksRepository repository) : IRequestHandler<GetBookByIdQuery, BookViewDto>
{
    public async Task<BookViewDto> Handle(GetBookByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting Book {BookId}", request.BookId);
        var entity = await repository.GetViewByIdAsync(request.BookId);
        
        if (entity == null)
            throw new NotFoundException(nameof(Book), request.BookId.ToString());
            
        return mapper.Map<BookViewDto>(entity);
    }
}
