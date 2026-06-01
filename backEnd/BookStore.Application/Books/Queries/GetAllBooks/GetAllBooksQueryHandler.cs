using AutoMapper;
using BookStore.Application.Books.Dtos;
using BookStore.Application.Common;
using BookStore.Domain.Repositories;
using BookStore.Domain.Views;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace BookStore.Application.Books.Queries.GetAllBooks;

internal class GetAllBooksQueryHandler(ILogger<GetAllBooksQueryHandler> logger
, IMapper mapper
, IBooksRepository booksRepository) 
: IRequestHandler<GetAllBooksQuery, PagedResult<MiniBookDto>>
{
    public async Task<PagedResult<MiniBookDto>> Handle(GetAllBooksQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all books");

        var (entity, totalCount) = await booksRepository.GetAllMatchingAsync(
            request.SearchPhrase,
            request.PageSize,
            request.PageNumber,
            request.SortBy,
            request.SortDirection);

        var books= mapper.Map<IEnumerable< MiniBookDto>>(entity);
      
        var result = new PagedResult<MiniBookDto>
        (books, totalCount, request.PageSize, request.PageNumber);
        return result!;
    }
}
