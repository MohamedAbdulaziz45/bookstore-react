using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

public class AddressesRepository(BookStoreDBContext dbContext) : IAddressesRepository
{
    public async Task<int> CreateAsync(Address address)
    {
        await dbContext.Addresses.AddAsync(address);
        await dbContext.SaveChangesAsync();
        return address.AddressId;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await dbContext.Addresses.FindAsync(id);
        if (entity == null) return false;
        dbContext.Addresses.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<Address>> GetByCustomerIdAsync(int customerId)
    {
       return await dbContext.Addresses
       .Where(c=>c.CustomerId == customerId).ToListAsync();
    }

    public async Task<Address?> GetByIdAsync(int id)
    {
        return await dbContext.Addresses.FirstOrDefaultAsync(a=>a.AddressId == id);
    }

    public async Task<Address?> GetDefaultByCustomerIdAsync(int customerId)
    {
        return await dbContext.Addresses.SingleOrDefaultAsync
        (a => a.CustomerId==customerId && a.IsDefault== true);
    }

    public async Task<bool> SetDefaultAsync(int customerId, int addressId)
    {
        var currentDefault = await GetDefaultByCustomerIdAsync(customerId);

        if (currentDefault != null)
        {
            currentDefault.IsDefault = false;
        }
        var entity=  await dbContext.Addresses.SingleOrDefaultAsync
            (a => a.CustomerId == customerId && a.AddressId == addressId);
        if(entity == null) return false;
        entity!.IsDefault = true;

        await dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateAsync(Address address)
    {
        dbContext.Addresses.Update(address);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
