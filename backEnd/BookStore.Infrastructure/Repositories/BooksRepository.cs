using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using BookStore.Domain.Views;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Linq.Expressions;

namespace BookStore.Infrastructure.Repositories;

internal class BooksRepository(BookStoreDBContext dbContext) : IBooksRepository
{
    public async Task<IEnumerable<Book>> GetAllAsync()
    {
        return await dbContext.Books
            .Include(b => b.Author)
            .Include(b => b.BookImage)
            .Include(b => b.BookGenres)
                .ThenInclude(bg => bg.Genre)
            .Include(b => b.OrderItems)
            .ToListAsync();
    }
    private async Task<(IEnumerable<MiniBookView>, int)> ExecutePagedQueryAsync(
    IQueryable<BookView> baseQuery,
    string? searchPhrase,
    int pageSize,
    int pageNumber,
    string? sortBy,
    SortDirection sortDirection)
    {
        var searchPhraseLower = searchPhrase?.ToLower();

        baseQuery = baseQuery.Where(b => searchPhraseLower == null ||
            b.Title.ToLower().Contains(searchPhraseLower) ||
            b.Author.ToLower().Contains(searchPhraseLower));

        var totalCount = await baseQuery.CountAsync();

        if (sortBy != null)
        {
            var columnSelector = new Dictionary<string, Expression<Func<BookView, object>>>
        {
            { nameof(BookView.Title), r => r.Title },
            { nameof(BookView.Price), r => r.Price },
            { nameof(BookView.Author), r => r.Author },
            { nameof(BookView.Rating), r => r.Rating },
            { nameof(BookView.PublicationDate), r => r.PublicationDate },
   
        };
         
        if (!columnSelector.TryGetValue(sortBy, out var selectedColumn))
                throw new BadRequestException($"Invalid sort column: {sortBy}");

            baseQuery = sortDirection == SortDirection.Ascending
                ? baseQuery.OrderBy(selectedColumn)
                : baseQuery.OrderByDescending(selectedColumn);
        }

        var bookViews = await baseQuery
            .Skip(pageSize * (pageNumber - 1))
            .Take(pageSize)
            .Select(b => new MiniBookView
            {
                Id = b.Id,
                Title = b.Title,
                Price = b.Price,
                Image = b.Image,
                Author = b.Author,
                AuthorId = b.AuthorId,
                Rating = b.Rating,
                ReviewCount = b.ReviewCount
            })
            .ToListAsync();

        return (bookViews, totalCount);
    }
    public  Task<(IEnumerable<MiniBookView>, int)> GetAllMatchingAsync
    (string? searchPhrase
    , int pageSize
    , int pageNumber
    , string? sortBy
    , SortDirection sortDirection) {

        var baseQuery = dbContext.BookViews;
        return ExecutePagedQueryAsync(baseQuery, searchPhrase, pageSize, pageNumber, sortBy, sortDirection);


    }

    public  Task<(IEnumerable<MiniBookView>, int)> GetAllByGenreIdAsync
    (int genreId
    ,string? searchPhrase
    , int pageSize
    , int pageNumber
    , string? sortBy
    , SortDirection sortDirection)
    {

        var baseQuery = dbContext.BookViews
            .Where(b => dbContext.BookGenres.Any(bg => bg.BookId == b.Id && bg.GenreId == genreId));
        return ExecutePagedQueryAsync(baseQuery, searchPhrase, pageSize, pageNumber, sortBy, sortDirection);
    }


    public async Task<Book?> GetByIdAsync(int id)
    {
        return await dbContext.Books
            .Include(b => b.Author)
            .Include(b => b.BookImage)
            .Include(b => b.BookGenres)
                .ThenInclude(bg => bg.Genre)
            .FirstOrDefaultAsync(b => b.BookId == id);
    }
    public async Task<BookView?> GetViewByIdAsync(int id)
    {
        return await dbContext.BookViews
            .FirstOrDefaultAsync(b => b.Id == id);
    }
    public async Task<int> CreateAsync(Book entity)
    {
        dbContext.Books.Add(entity);
        await dbContext.SaveChangesAsync();
        return entity.BookId;
    }

    public async Task<bool> UpdateAsync(Book entity)
    {
        dbContext.Books.Update(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await dbContext.Books.FindAsync(id);
        if (entity == null) return false;
        dbContext.Books.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }

   public async Task<IEnumerable<PreviewBookView>> GetByIdsAsync(IEnumerable<int> ids){

        var books = await dbContext.Books
        .Where(b => ids.Contains(b.BookId))
        .Select(b => new PreviewBookView(
        b.BookId,
        b.Title,
        b.Price,
        b.QuantityInStock,
        b.BookImage != null ? b.BookImage.ImageURL : null
    ))
    .ToListAsync();

    return books;
    }

    public async  Task<(IEnumerable<MiniBookView> Books, int TotalCount, bool IsFallback)>GetFeaturedAsync
    (string? searchPhrase,int pageSize, int pageNumber,string? sortBy, SortDirection sortDirection)
    {
        var featuredQuery = dbContext.BookViews.Where(b => b.IsFeatured);
        var hasFeaturedBooks = await featuredQuery.AnyAsync();
        
        IQueryable<BookView> baseQuery;
       
        if (hasFeaturedBooks)
        {
            baseQuery = featuredQuery;
        }
        else 
        {
            baseQuery = dbContext.BookViews.AsQueryable();
        }
        //var baseQuery = hasFeaturedBooks ? featuredQuery: dbContext.BookViews.AsQueryable();

        var orderedQuery = hasFeaturedBooks
        ? baseQuery.OrderByDescending(b => b.FeaturedAt) : baseQuery;
       
        var (books,totalCount)= await 
        ExecutePagedQueryAsync(orderedQuery, searchPhrase, pageSize, pageNumber, sortBy, sortDirection);

        return (books, totalCount, !hasFeaturedBooks);
    }
    public async Task<(IEnumerable<MiniBookView> Books, int TotalCount, bool IsFallback)> GetEditorsPicksAsync(
    string? searchPhrase, int pageSize, int pageNumber, string? sortBy, SortDirection sortDirection)
    {
        var curatedQuery = dbContext.BookViews.Where(b => b.IsEditorsPick);
        var hasCuratedBooks = await curatedQuery.AnyAsync();

        var baseQuery = hasCuratedBooks ? curatedQuery : dbContext.BookViews.AsQueryable();

        var orderedQuery = hasCuratedBooks
            ? baseQuery.OrderByDescending(b => b.EditorsPickAt): baseQuery;



        var (books, totalCount) = await ExecutePagedQueryAsync(
            orderedQuery, searchPhrase, pageSize, pageNumber, sortBy, sortDirection);

        return (books, totalCount, !hasCuratedBooks);
    }
    public  Task<(IEnumerable<MiniBookView>, int)> GetByAuthorIdAsync(
    int authorId,
    string? searchPhrase,
    int pageSize,
    int pageNumber,
    string? sortBy,
    SortDirection sortDirection)
    {
        var baseQuery = dbContext.BookViews
        .Where(b => b.AuthorId == authorId);
        return ExecutePagedQueryAsync(baseQuery, searchPhrase, pageSize, pageNumber, sortBy, sortDirection);

    }

    public async Task<MiniBookView?> GetFeaturedOrNewestAsync()
    {
        var featuredQuery = dbContext.BookViews
        .Where(b => b.IsFeatured);

        var isFeatured = await featuredQuery.AnyAsync();

        var query = isFeatured ? featuredQuery
        .OrderByDescending(b => b.FeaturedAt)   
        .ThenByDescending(b => b.PublicationDate)
        .ThenByDescending(b => b.Id) : OrderByNewest(dbContext.BookViews);
        
        return await ProjectToMiniBookView(query).FirstOrDefaultAsync();
    }
    private static IOrderedQueryable<BookView> OrderByNewest(IQueryable<BookView> query)
    {
        return query.OrderByDescending(query => query.PublicationDate)
        .ThenByDescending(b => b.Id);
    }
    private static IQueryable<MiniBookView> ProjectToMiniBookView(IQueryable<BookView> query)
    {
        return query.Select(b => new MiniBookView
        {
            Id = b.Id,
            Title = b.Title,
            Price = b.Price,
            Image = b.Image,
            Author = b.Author,
            AuthorId = b.AuthorId,
            Rating = b.Rating,
            ReviewCount = b.ReviewCount,
        });
    }
}
