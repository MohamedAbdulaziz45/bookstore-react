using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class CustomersRepository(BookStoreDBContext dbContext) : ICustomersRepository
{
    public async Task<IEnumerable<Customer>> GetAllAsync()
    {
        return await dbContext.Customers
            .Include(c => c.User)
            .Include(c => c.Orders)
            .Include(c => c.Reviews)
            .ToListAsync();
    }

    public async Task<Customer?> GetByIdAsync(int id)
    {
        return await dbContext.Customers
            .Include(c => c.User)
            .Include(c => c.Orders)
            .Include(c => c.Reviews)
            .FirstOrDefaultAsync(c => c.CustomerId == id);
    }

    public async Task<int> CreateAsync(Customer entity)
    {
        dbContext.Customers.Add(entity);
        await dbContext.SaveChangesAsync();
        return entity.CustomerId;
    }

    public async Task<bool> UpdateAsync(Customer entity)
    {
        dbContext.Customers.Update(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await dbContext.Customers.FindAsync(id);
        if (entity == null) return false;
        entity.IsDeleted = true;
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<Customer?> GetByUserIdAsync(string userId)
    {
        return await dbContext.Customers
        .Include(c => c.User)
        .SingleOrDefaultAsync(c => c.UserId == userId);
    }

    public async Task<Customer?> GetByStripeCustomerIdAsync(string stripeCustomerId)
    {
        return await dbContext.Customers
      .SingleOrDefaultAsync(c => c.StripeCustomerId == stripeCustomerId);
    }
}
