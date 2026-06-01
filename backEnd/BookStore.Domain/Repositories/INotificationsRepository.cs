using BookStore.Domain.Entities;

namespace BookStore.Domain.Repositories;

public interface INotificationsRepository
{
    Task<IEnumerable<Notification>> GetByCustomerIdAsync(int customerId);
    Task<int> GetUnreadCountByCustomerIdAsync(int customerId);
    Task<Notification?> GetByIdAsync(int notificationId);
    Task<int> CreateAsync(Notification notification);
    Task<bool> MarkAsReadAsync(int notificationId);
    Task<int> MarkAllAsReadAsync(int customerId);
}

