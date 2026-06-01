using BookStore.Domain.Entities;

namespace BookStore.Domain.Repositories;

public interface IAuthorsRepository
{
    Task<IEnumerable<Author>> GetAllAsync();
    Task<Author?> GetByIdAsync(int id);
    Task<int> Create(Author entity);
    Task Delete(Author entity);
    Task<bool> DeleteAsync(int id);
    Task<bool> UpdateAsync(Author entity);
    Task SaveChanges();
    Task<bool> IsAuthorExist(int authorId);
    //Task<(Author? Author, bool IsFallBack)> GetFeaturedOrFallbackAsync(int? fallbackAuthorId = null);
    Task<Author?> GetFeaturedAuthorAsync();
    Task<Author?> GetLastResortAuthorWithBooksAsync();
}
