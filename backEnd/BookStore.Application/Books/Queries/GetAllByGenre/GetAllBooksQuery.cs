using BookStore.Application.Books.Dtos;
using BookStore.Application.Common;
using BookStore.Domain.Constants;
using MediatR;


namespace BookStore.Application.Books.Queries.GetAllByGenre;

public class GetAllByGenreQuery : IRequest<PagedResult<MiniBookDto>>
{
    public int GenreId{  get; set; }
    public string? SearchPhrase { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public string? SortBy { get; set; }
    public SortDirection SortDirection { get; set; }
}
