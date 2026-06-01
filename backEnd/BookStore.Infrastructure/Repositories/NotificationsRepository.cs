using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class NotificationsRepository(BookStoreDBContext dbContext) : INotificationsRepository
{
    public async Task<IEnumerable<Notification>> GetByCustomerIdAsync(int customerId)
    {
        return await dbContext.Notifications
            .Where(n => n.CustomerId == customerId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountByCustomerIdAsync(int customerId)
    {
        return await dbContext.Notifications
            .CountAsync(n => n.CustomerId == customerId && !n.IsRead);
    }

    public async Task<Notification?> GetByIdAsync(int notificationId)
    {
        return await dbContext.Notifications.FindAsync(notificationId);
    }

    public async Task<int> CreateAsync(Notification notification)
    {
        dbContext.Notifications.Add(notification);
        await dbContext.SaveChangesAsync();
        return notification.NotificationId;
    }

    public async Task<bool> MarkAsReadAsync(int notificationId)
    {
        var entity = await dbContext.Notifications.FindAsync(notificationId);
        if (entity == null) return false;
        entity.IsRead = true;
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<int> MarkAllAsReadAsync(int customerId)
    {
        var entities = await dbContext.Notifications
            .Where(n => n.CustomerId == customerId && !n.IsRead)
            .ToListAsync();

        foreach (var item in entities) item.IsRead = true;
        await dbContext.SaveChangesAsync();
        return entities.Count;
    }
}

