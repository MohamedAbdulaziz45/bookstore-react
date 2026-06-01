using BookStore.Application.Books.Dtos;
using BookStore.Application.Common;
using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Books.Queries.GetAdminBooks;

internal class GetAdminBooksQueryHandler(
    ILogger<GetAdminBooksQueryHandler> logger,
    IBooksRepository booksRepository) : IRequestHandler<GetAdminBooksQuery, PagedResult<AdminBookDto>>
{
    public async Task<PagedResult<AdminBookDto>> Handle(GetAdminBooksQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting admin books");

        var pageNumber = request.PageNumber <= 0 ? 1 : request.PageNumber;
        var pageSize = request.PageSize <= 0 ? 20 : request.PageSize;
        var search = request.SearchPhrase?.Trim().ToLowerInvariant();

        var query = (await booksRepository.GetAllAsync()).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(b =>
                b.Title.ToLower().Contains(search) ||
                b.ISBN.ToLower().Contains(search) ||
                b.Author.Name.ToLower().Contains(search) ||
                b.BookGenres.Any(bg => bg.Genre.GenreName.ToLower().Contains(search)));
        }

        query = ApplySorting(query, request.SortBy, request.SortDirection);

        var totalCount = query.Count();
        var books = query
            .Skip(pageSize * (pageNumber - 1))
            .Take(pageSize)
            .Select(MapToDto)
            .ToList();

        return new PagedResult<AdminBookDto>(books, totalCount, pageSize, pageNumber);
    }

    private static IQueryable<Book> ApplySorting(IQueryable<Book> query, string? sortBy, SortDirection direction)
    {
        var descending = direction == SortDirection.Descending;
        var normalized = sortBy?.Trim().ToLowerInvariant();

        return normalized switch
        {
            "title" => descending ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title),
            "isbn" => descending ? query.OrderByDescending(b => b.ISBN) : query.OrderBy(b => b.ISBN),
            "author" => descending ? query.OrderByDescending(b => b.Author.Name) : query.OrderBy(b => b.Author.Name),
            "price" => descending ? query.OrderByDescending(b => b.Price) : query.OrderBy(b => b.Price),
            "stock" or "quantityinstock" => descending ? query.OrderByDescending(b => b.QuantityInStock) : query.OrderBy(b => b.QuantityInStock),
            "publicationdate" => descending ? query.OrderByDescending(b => b.PublicationDate) : query.OrderBy(b => b.PublicationDate),
            _ => query.OrderByDescending(b => b.BookId)
        };
    }

    private static AdminBookDto MapToDto(Book book) => new()
    {
        Id = book.BookId,
        Title = book.Title,
        ISBN = book.ISBN,
        Author = book.Author.Name,
        AuthorId = book.AuthorId,
        Genres = book.BookGenres.Select(bg => new CategoryDto
        {
            Id = bg.GenreId,
            Name = bg.Genre.GenreName
        }).ToList(),
        Price = book.Price,
        Stock = book.QuantityInStock,
        PublicationDate = book.PublicationDate,
        AdditionalDetails = book.AdditionalDetails,
        ImageUrl = book.BookImage?.ImageURL,
        IsFeatured = book.IsFeatured,
        FeaturedAt = book.FeaturedAt,
        IsEditorsPick = book.IsEditorsPick,
        EditorsPickAt = book.EditorsPickAt
    };
}
