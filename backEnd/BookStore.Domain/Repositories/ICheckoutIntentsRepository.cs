using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Domain.Repositories;

public interface ICheckoutIntentsRepository
{
    Task<CheckoutIntent?> GetByStripeSessionIdAsync(string sessionId);
    Task<CheckoutIntent?> GetByIdWithItemsAsync(int id);
    Task<int> CreateAsync(CheckoutIntent checkoutIntent);
    Task<bool> UpdateStripeSessionAsync(int checkoutIntentId, string stripeSessionId, string stripeCustomerId);
    Task<bool> MarkFailedAsync(int checkoutIntentId, string reason);
    Task<bool> MarkExpiredAsync(string stripeSessionId);
    Task SaveChanges();

}
