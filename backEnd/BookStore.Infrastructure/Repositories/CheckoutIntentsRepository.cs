using BookStore.Domain.Constants;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

public class CheckoutIntentsRepository(BookStoreDBContext dbContext) : ICheckoutIntentsRepository
{
    public async Task<int> CreateAsync(CheckoutIntent checkoutIntent)
    {
        await dbContext.CheckoutIntents.AddAsync(checkoutIntent);
        await dbContext.SaveChangesAsync();
        return checkoutIntent.CheckoutIntentId;
    }

    public async Task<CheckoutIntent?> GetByIdWithItemsAsync(int id)
    {
        var entity = await dbContext.CheckoutIntents
        .Include(ch => ch.Items)
         .ThenInclude(i => i.Book)
        .SingleOrDefaultAsync(c => c.CheckoutIntentId == id);
        return entity;
    }

    public async Task<CheckoutIntent?> GetByStripeSessionIdAsync(string sessionId)
    {
        var entity = await dbContext.CheckoutIntents
        .Include(ch => ch.Items)
         .ThenInclude(i => i.Book)
        .SingleOrDefaultAsync(c => c.StripeSessionId == sessionId);
        return entity;
    }

    public async Task<bool> MarkExpiredAsync(string stripeSessionId)
    {
       var entity = await dbContext.CheckoutIntents
         .SingleOrDefaultAsync(c => c.StripeSessionId == stripeSessionId);

       if (entity == null){
       return false;
       }
        if (entity.Status == CheckoutIntentStatus.Fulfilled)
        {
            return false;
        }
        entity.Status = CheckoutIntentStatus.Expired;

       return await dbContext.SaveChangesAsync()>0;

    }

    public async Task<bool> MarkFailedAsync(int checkoutIntentId, string reason)
    {
        var entity = await dbContext.CheckoutIntents
      .SingleOrDefaultAsync(c => c.CheckoutIntentId == checkoutIntentId);

        if (entity == null)
        {
            return false;
        }
        if (entity.Status == CheckoutIntentStatus.Fulfilled || entity.Status==CheckoutIntentStatus.Expired)
        {
            return false;
        }
        entity.Status = CheckoutIntentStatus.Failed;
        entity.FailureReason = reason;
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateStripeSessionAsync(int checkoutIntentId, string stripeSessionId, string stripeCustomerId)
    {
        var entity = await dbContext.CheckoutIntents
            .SingleOrDefaultAsync(c => c.CheckoutIntentId == checkoutIntentId);
        if (entity == null)
        {
            return false;
        }
        if (entity.Status is CheckoutIntentStatus.Fulfilled
       or CheckoutIntentStatus.Expired
       or CheckoutIntentStatus.Failed)
        {
            return false;
        }

        entity.Status = CheckoutIntentStatus.SessionCreated;
        entity.StripeSessionId = stripeSessionId;
        entity.StripeCustomerId = stripeCustomerId;
        return await dbContext.SaveChangesAsync() > 0;

    }
    public async Task SaveChanges()
    {
        await dbContext.SaveChangesAsync();
    }


}
