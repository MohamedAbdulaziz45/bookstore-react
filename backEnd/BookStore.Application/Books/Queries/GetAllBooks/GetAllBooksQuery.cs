using BookStore.Application.Books.Dtos;
using BookStore.Application.Common;
using BookStore.Domain.Constants;
using BookStore.Domain.Views;
using MediatR;
using System.Collections.Generic;

namespace BookStore.Application.Books.Queries.GetAllBooks;

public class GetAllBooksQuery : IRequest<PagedResult<MiniBookDto>>
{
    public string? SearchPhrase { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public string? SortBy { get; set; }
    public SortDirection SortDirection { get; set; }
}
