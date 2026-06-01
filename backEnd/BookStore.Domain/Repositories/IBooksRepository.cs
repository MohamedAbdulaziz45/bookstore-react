using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Views;

namespace BookStore.Domain.Repositories;

public interface IBooksRepository
{
    Task<IEnumerable<Book>> GetAllAsync();
    Task<Book?> GetByIdAsync(int id);
    Task<int> CreateAsync(Book entity);
    Task<bool> UpdateAsync(Book entity);
    Task<bool> DeleteAsync(int id);
    Task<BookView?> GetViewByIdAsync(int id);
    Task<(IEnumerable<MiniBookView>, int)> GetAllMatchingAsync(
       string? searchPhrase,
       int pageSize,
       int pageNumber,
       string? sortBy,
       SortDirection sortDirection);

    Task<(IEnumerable<MiniBookView>, int)> GetAllByGenreIdAsync
       (int genreId
       , string? searchPhrase
       , int pageSize
       , int pageNumber
       , string? sortBy
       , SortDirection sortDirection);

    Task<IEnumerable<PreviewBookView>> GetByIdsAsync(IEnumerable<int> ids);
    Task<(IEnumerable<MiniBookView>, int)> GetByAuthorIdAsync(
    int authorId,
    string? searchPhrase,
    int pageSize,
    int pageNumber,
    string? sortBy,
    SortDirection sortDirection);
    Task<MiniBookView?> GetFeaturedOrNewestAsync();
    Task<(IEnumerable<MiniBookView> Books, int TotalCount, bool IsFallback)> GetEditorsPicksAsync(
     string? searchPhrase, int pageSize, int pageNumber, string? sortBy, SortDirection sortDirection);
    Task<(IEnumerable<MiniBookView> Books, int TotalCount, bool IsFallback)> GetFeaturedAsync
     (string? searchPhrase, int pageSize, int pageNumber, string? sortBy, SortDirection sortDirection);
}
