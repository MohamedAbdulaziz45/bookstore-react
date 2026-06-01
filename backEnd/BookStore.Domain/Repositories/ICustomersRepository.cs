using BookStore.Domain.Entities;

namespace BookStore.Domain.Repositories;

public interface ICustomersRepository
{
    Task<IEnumerable<Customer>> GetAllAsync();
    Task<Customer?> GetByIdAsync(int id);
    Task<int> CreateAsync(Customer entity);
    Task<bool> UpdateAsync(Customer entity);
    Task<bool> DeleteAsync(int id);
    Task<Customer?>GetByUserIdAsync(string userId);
    Task<Customer?> GetByStripeCustomerIdAsync(string stripeCustomerId);
}
