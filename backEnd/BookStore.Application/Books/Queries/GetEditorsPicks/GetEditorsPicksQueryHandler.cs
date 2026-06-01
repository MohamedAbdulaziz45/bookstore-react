using AutoMapper;
using BookStore.Application.Books.Dtos;
using BookStore.Application.Common;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Books.Queries.GetEditorsPicks;

internal class GetEditorsPicksQueryHandler(
    ILogger<GetEditorsPicksQueryHandler> logger,
    IMapper mapper,
    IBooksRepository booksRepository)
    : IRequestHandler<GetEditorsPicksQuery, PagedResult<MiniBookDto, bool>>
{
    public async Task<PagedResult<MiniBookDto, bool>> Handle(GetEditorsPicksQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting editor picks");
        var (entities, totalCount, isFallback) =
        await booksRepository.GetEditorsPicksAsync
        (request.SearchPhrase, request.PageSize, request.PageNumber, request.SortBy, request.SortDirection);
        var books = mapper.Map<IEnumerable<MiniBookDto>>(entities);
        return new PagedResult<MiniBookDto,bool>(books, totalCount, request.PageSize, request.PageNumber, isFallback);

    }
}
