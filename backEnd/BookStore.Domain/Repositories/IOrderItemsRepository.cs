using BookStore.Domain.Entities;

namespace BookStore.Domain.Repositories;

public interface IOrderItemsRepository
{
    Task<IEnumerable<OrderItem>> GetAllAsync();
    Task<OrderItem?> GetByIdAsync(int id);
    Task<int> CreateAsync(OrderItem entity);
    Task<bool> UpdateAsync(OrderItem entity);
    Task<bool> DeleteAsync(int id);
}
