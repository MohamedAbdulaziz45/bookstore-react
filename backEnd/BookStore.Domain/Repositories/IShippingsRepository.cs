using BookStore.Domain.Entities;

namespace BookStore.Domain.Repositories;

public interface IShippingsRepository
{
    Task<IEnumerable<Shipping>> GetAllAsync();
    Task<Shipping?> GetByIdAsync(int id);
    Task<int> CreateAsync(Shipping entity);
    Task<bool> UpdateAsync(Shipping entity);
    Task<bool> DeleteAsync(int id);
}
