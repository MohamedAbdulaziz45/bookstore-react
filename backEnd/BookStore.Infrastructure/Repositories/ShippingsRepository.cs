using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class ShippingsRepository(BookStoreDBContext dbContext) : IShippingsRepository
{
    public async Task<IEnumerable<Shipping>> GetAllAsync()
    {
        return await dbContext.Shippings
            .Include(s => s.Order)
                .ThenInclude(o => o!.Customer)
                    .ThenInclude(c => c!.User)
            .OrderByDescending(s => s.EstimatedDeliveryDate)
            .ToListAsync();
    }

    public async Task<Shipping?> GetByIdAsync(int id)
    {
        return await dbContext.Shippings
            .Include(s => s.Order)
                .ThenInclude(o => o!.Customer)
                    .ThenInclude(c => c!.User)
            .FirstOrDefaultAsync(s => s.ShippingId == id);
    }

    public async Task<int> CreateAsync(Shipping entity)
    {
        dbContext.Shippings.Add(entity);
        await dbContext.SaveChangesAsync();
        return entity.ShippingId;
    }

    public async Task<bool> UpdateAsync(Shipping entity)
    {
        dbContext.Shippings.Update(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await dbContext.Shippings.FindAsync(id);
        if (entity == null) return false;
        dbContext.Shippings.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
