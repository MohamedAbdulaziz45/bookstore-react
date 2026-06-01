using BookStore.Domain.Constants;
using BookStore.Domain.Entities;

namespace BookStore.Domain.Repositories;

public interface IOrdersRepository
{
    Task<IEnumerable<Order>> GetAllAsync();
    Task<Order?> GetByIdAsync(int id);
    Task<int> CreateAsync(Order entity);
    Task<bool> UpdateAsync(Order entity);
    Task<Order?> GetByIdWithDetailsAsync(int id);
    Task<Order?> GetByStripeSessionIdAsync(string sessionId);
    Task<IEnumerable<Order>> GetByCustomerIdAsync(int customerId);
    Task<bool> UpdateStatusAsync(int orderId, OrderStatus status);
    Task<bool> HasCustomerPurchasedBookAsync(int customerId, int bookId);
}
