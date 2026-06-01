using BookStore.Domain.Entities;
using BookStore.Domain.Views;

namespace BookStore.Domain.Repositories;

public interface IGenresRepository
{
    Task<IEnumerable<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(int id);
    Task<int> CreateAsync(Category entity);
    Task<bool> UpdateAsync(Category entity);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<GenreView>> GetAllGenresAndCountAsync();
}
