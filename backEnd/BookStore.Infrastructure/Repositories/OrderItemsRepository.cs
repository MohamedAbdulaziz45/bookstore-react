using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class OrderItemsRepository(BookStoreDBContext dbContext) : IOrderItemsRepository
{
    public async Task<IEnumerable<OrderItem>> GetAllAsync()
    {
        return await dbContext.OrderItems.ToListAsync();
    }

    public async Task<OrderItem?> GetByIdAsync(int id)
    {
        return await dbContext.OrderItems.FindAsync(id);
    }

    public async Task<int> CreateAsync(OrderItem entity)
    {
        dbContext.OrderItems.Add(entity);
        await dbContext.SaveChangesAsync();
        return entity.OrderItemId;
    }

    public async Task<bool> UpdateAsync(OrderItem entity)
    {
        dbContext.OrderItems.Update(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await dbContext.OrderItems.FindAsync(id);
        if (entity == null) return false;
        dbContext.OrderItems.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
