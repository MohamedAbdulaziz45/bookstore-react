using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Domain.Views;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class ReviewsRepository(BookStoreDBContext dbContext) : IReviewsRepository
{
    public async Task<IEnumerable<Review>> GetAllAsync()
    {
        return await dbContext.Reviews.ToListAsync();
    }
    public async Task<IEnumerable<ReviewView>> GetAllViewAsync()
    {
        return await dbContext.ReviewsViews.ToListAsync();
    }
    public async Task<IEnumerable<ReviewView>> GetAllViewByBookIdAsync(int bookId)
    {
      return await dbContext.ReviewsViews
     .Where(r => r.BookId == bookId)
     .ToListAsync();
    }
    public async Task<Review?> GetByIdAsync(int id)
    {
        return await dbContext.Reviews.FindAsync(id);
    }

    public async Task<int> CreateAsync(Review entity)
    {
        dbContext.Reviews.Add(entity);
        await dbContext.SaveChangesAsync();
        return entity.ReviewId;
    }

    public async Task<bool> UpdateAsync(Review entity)
    {
        dbContext.Reviews.Update(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await dbContext.Reviews.FindAsync(id);
        if (entity == null) return false;
        dbContext.Reviews.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<ReviewView?> GetViewByIdAsync(int id)
    {
        return await dbContext.ReviewsViews.FirstOrDefaultAsync(r=>r.ReviewId == id);
    }

    public async Task<bool> HasReviewForBookAsync(int customerId,int bookId)
    {
        return await dbContext.Reviews
            .AnyAsync(r => r.CustomerId == customerId && r.BookId == bookId);
    }
    public async Task<IEnumerable<Review>> GetAllByCustomerIdAsync(int customerId)
    {
        return await dbContext.Reviews
            .Where(r => r.CustomerId == customerId)
            .OrderByDescending(r =>r.ReviewDate)
            .ToListAsync();
    }
    public async Task<Review?> GetByCustomerIdAndBookIdAsync(int customerId, int bookId)
    {
        return await dbContext.Reviews
            .FirstOrDefaultAsync(r => r.CustomerId == customerId && r.BookId == bookId);
    }

    public async Task<IEnumerable<ReviewView>> GetAllViewByUserIdAsync(string userId)
    {
        return await dbContext.ReviewsViews
            .Where(r => r.UserId == userId)
            .ToListAsync();
    }
}
