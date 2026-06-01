using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class NewsletterSubscriptionsRepository(BookStoreDBContext dbContext) : INewsletterSubscriptionsRepository
{
    public async Task<NewsletterSubscription?> GetByEmailAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLower();
        return await dbContext.NewsletterSubscriptions
            .FirstOrDefaultAsync(n => n.Email.ToLower() == normalizedEmail);
    }

    public async Task CreateAsync(NewsletterSubscription entity)
    {
        dbContext.NewsletterSubscriptions.Add(entity);
        await dbContext.SaveChangesAsync();
    }

    public async Task<bool> UpdateAsync(NewsletterSubscription entity)
    {
        dbContext.NewsletterSubscriptions.Update(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
