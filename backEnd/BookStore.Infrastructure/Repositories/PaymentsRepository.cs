using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class PaymentsRepository(BookStoreDBContext dbContext) : IPaymentsRepository
{
    public async Task<IEnumerable<Payment>> GetAllAsync()
    {
        return await dbContext.Payments
            .Include(p => p.Order)
                .ThenInclude(o => o!.Customer)
                    .ThenInclude(c => c!.User)
            .OrderByDescending(p => p.TransactionDate)
            .ToListAsync();
    }

    public async Task<Payment?> GetByIdAsync(int id)
    {
        return await dbContext.Payments.FindAsync(id);
    }
    public async Task<Payment?> GetByOrderIdAsync(int orderId)
    {
        return await dbContext.Payments
            .SingleOrDefaultAsync(p => p.OrderId == orderId);
    }

    public async Task<int> CreateAsync(Payment entity)
    {
        dbContext.Payments.Add(entity);
        await dbContext.SaveChangesAsync();
        return entity.PaymentId;
    }

    public async Task<bool> UpdateAsync(Payment entity)
    {
        dbContext.Payments.Update(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await dbContext.Payments.FindAsync(id);
        if (entity == null) return false;
        dbContext.Payments.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
