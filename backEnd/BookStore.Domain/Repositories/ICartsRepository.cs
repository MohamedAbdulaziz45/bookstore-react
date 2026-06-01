using BookStore.Domain.Entities;

namespace BookStore.Domain.Repositories;

public interface ICartsRepository
{
    Task<Cart?> GetByCustomerIdAsync(int customerId);
    Task<bool> ExistsAsync(int customerId);
    Task<int> CreateAsync(Cart cart);
    Task RemoveItemAsync(int cartItemId);
    Task ClearCartAsync(int cartId);
    Task ClearCartByCustomerIdAsync(int customerId);
    Task SaveChanges();
}
