using BookStore.Application.Books.Dtos;
using BookStore.Application.Common;
using BookStore.Domain.Constants;
using MediatR;

namespace BookStore.Application.Authors.Queries.GetAuthorBooks;

public class GetAuthorBooksQuery(int authorId) : IRequest<PagedResult<MiniBookDto>>
{
    public int AuthorId { get; } = authorId;
    public string? SearchPhrase { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public string? SortBy { get; set; }
    public SortDirection SortDirection { get; set; }
}
