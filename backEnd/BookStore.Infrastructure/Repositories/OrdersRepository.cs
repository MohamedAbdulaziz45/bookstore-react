using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class OrdersRepository(BookStoreDBContext dbContext) : IOrdersRepository
{
    public async Task<IEnumerable<Order>> GetAllAsync()
    {
        return await dbContext.Orders
            .Include(o => o.Customer)
                .ThenInclude(c => c!.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
            .Include(o => o.Payment)
            .Include(o => o.Shipping)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await dbContext.Orders.FindAsync(id);
    }

    public async Task<int> CreateAsync(Order entity)
    {
        dbContext.Orders.Add(entity);
        await dbContext.SaveChangesAsync();
        return entity.OrderId;
    }

    public async Task<bool> UpdateAsync(Order entity)
    {
        dbContext.Orders.Update(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }



    public async Task<Order?> GetByIdWithDetailsAsync(int id)
    {
       return await dbContext.Orders
       .Include(o=>o.SavedAddress)
       .Include(o=>o.Customer)
       .ThenInclude(c=>c!.User)
       .Include(o=>o.OrderItems)
       .ThenInclude(oi=>oi.Book)
       .Include(o=>o.Payment)
       .Include(o=>o.Shipping)
       .SingleOrDefaultAsync(o=>o.OrderId == id);
    }

    public async Task<Order?> GetByStripeSessionIdAsync(string sessionId)
    {
        return await dbContext.Orders
 .Include(o => o.SavedAddress)
 .Include(o => o.OrderItems)
 .ThenInclude(oi => oi.Book)
 .Include(o => o.Payment)
 .Include(o => o.Shipping)
 .SingleOrDefaultAsync(o => o.StripeSessionId == sessionId);
    }

    public async Task<IEnumerable<Order>> GetByCustomerIdAsync(int customerId)
    {
        return await dbContext.Orders
            .Where(o => o.CustomerId == customerId)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
            .Include(o => o.Payment)
            .Include(o => o.Shipping)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
    }

    public async Task<bool> UpdateStatusAsync(int orderId, OrderStatus status)
    {
        var entity = await dbContext.Orders.FindAsync(orderId);


        if (entity == null)
        {
            return false;
        }

        entity.Status = status;

        return await dbContext.SaveChangesAsync() > 0;
    }
    public async Task<bool> HasCustomerPurchasedBookAsync(int customerId, int bookId)
    {
        return await dbContext.Orders
            .Where(o => o.CustomerId == customerId && o.Status == OrderStatus.Delivered)
            .AnyAsync(o => o.OrderItems.Any(i => i.BookId == bookId));
    }
}
