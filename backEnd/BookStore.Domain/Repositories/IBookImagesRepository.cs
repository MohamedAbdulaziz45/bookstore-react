using BookStore.Domain.Entities;

namespace BookStore.Domain.Repositories;

public interface IBookImagesRepository
{
    Task<IEnumerable<BookImage>> GetAllAsync();
    Task<BookImage?> GetByIdAsync(int id);
    Task<int> CreateAsync(BookImage entity);
    Task<bool> UpdateAsync(BookImage entity);
    Task<bool> DeleteAsync(int id);
}
