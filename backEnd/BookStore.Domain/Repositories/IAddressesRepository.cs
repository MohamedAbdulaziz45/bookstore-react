using BookStore.Domain.Entities;

namespace BookStore.Domain.Repositories;

public interface IAddressesRepository
{
    Task<IEnumerable<Address>> GetByCustomerIdAsync(int customerId);
    Task<Address?> GetByIdAsync(int id);
    Task<Address?> GetDefaultByCustomerIdAsync(int customerId);
    Task<int> CreateAsync(Address address);
    Task<bool> UpdateAsync(Address address);
    Task<bool> DeleteAsync(int id);
    Task<bool> SetDefaultAsync(int customerId, int addressId);
}
