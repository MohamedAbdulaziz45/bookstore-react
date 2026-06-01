using AutoMapper;
using BookStore.Application.Books.Dtos;
using BookStore.Application.Common;
using BookStore.Domain.Repositories;
using BookStore.Domain.Views;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace BookStore.Application.Books.Queries.GetAllByGenre;

internal class GetAllByGenreQueryHandler(ILogger<GetAllByGenreQueryHandler> logger
, IMapper mapper
, IBooksRepository booksRepository) 
: IRequestHandler<GetAllByGenreQuery, PagedResult<MiniBookDto>>
{
    public async Task<PagedResult<MiniBookDto>> Handle(GetAllByGenreQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all books");

        var (entity, totalCount) = await booksRepository.GetAllByGenreIdAsync(
            request.GenreId,
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
