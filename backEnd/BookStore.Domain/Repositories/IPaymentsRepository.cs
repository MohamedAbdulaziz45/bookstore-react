using BookStore.Domain.Entities;

namespace BookStore.Domain.Repositories;

public interface IPaymentsRepository
{
    Task<IEnumerable<Payment>> GetAllAsync();
    Task<Payment?> GetByIdAsync(int id);
    Task<int> CreateAsync(Payment entity);
    Task<Payment?> GetByOrderIdAsync(int orderId);
    Task<bool> UpdateAsync(Payment entity);
    Task<bool> DeleteAsync(int id);
}
