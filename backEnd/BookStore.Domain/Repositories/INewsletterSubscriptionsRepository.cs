using BookStore.Domain.Entities;

namespace BookStore.Domain.Repositories;

public interface INewsletterSubscriptionsRepository
{
    Task<NewsletterSubscription?> GetByEmailAsync(string email);
    Task CreateAsync(NewsletterSubscription entity);
    Task<bool> UpdateAsync(NewsletterSubscription entity);
}
