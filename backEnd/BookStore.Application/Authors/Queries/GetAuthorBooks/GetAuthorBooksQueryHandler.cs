using AutoMapper;
using BookStore.Application.Books.Dtos;
using BookStore.Application.Common;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Application.Authors.Queries.GetAuthorBooks;

internal class GetAuthorBooksQueryHandler
(
    ILogger<GetAuthorBooksQueryHandler> logger,
    IMapper mapper,
    IAuthorsRepository authorsRepository,
    IBooksRepository booksRepository)
: IRequestHandler<GetAuthorBooksQuery, PagedResult<MiniBookDto>>

{
    public async Task<PagedResult<MiniBookDto>> Handle(GetAuthorBooksQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting books for Author {AuthorId}", request.AuthorId);

        if (!await authorsRepository.IsAuthorExist(request.AuthorId))
            throw new NotFoundException(nameof(Author), request.AuthorId.ToString());

        var (entities, totalCount) = await booksRepository.GetByAuthorIdAsync(
            request.AuthorId,
            request.SearchPhrase,
            request.PageSize,
            request.PageNumber,
            request.SortBy,
            request.SortDirection);

        var books = mapper.Map<IEnumerable<MiniBookDto>>(entities);
        return new PagedResult<MiniBookDto>(books, totalCount, request.PageSize, request.PageNumber);
    }
}
