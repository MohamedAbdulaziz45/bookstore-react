using AutoMapper;
using BookStore.Application.Books.Dtos;
using BookStore.Application.Common;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Books.Queries.GetFeaturBooks;

internal class GetFeaturedBooksQueryHandler(
    ILogger<GetFeaturedBooksQueryHandler> logger,
    IMapper mapper,
    IBooksRepository booksRepository)
    : IRequestHandler<GetFeaturedBooksQuery, PagedResult<MiniBookDto, bool>>
{
    public async Task<PagedResult<MiniBookDto, bool>> Handle(GetFeaturedBooksQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting featured books");
        var (entities, totalCount, isFallback)
        = await booksRepository.GetFeaturedAsync
        (request.SearchPhrase, request.PageSize, request.PageNumber, request.SortBy, request.SortDirection);

        var books = mapper.Map<IEnumerable<MiniBookDto>>(entities);

        return new PagedResult<MiniBookDto,bool>(books, totalCount, request.PageSize, request.PageNumber, isFallback);

    }
}
