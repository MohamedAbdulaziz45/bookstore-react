using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class BookImagesRepository(BookStoreDBContext dbContext) : IBookImagesRepository
{
    public async Task<IEnumerable<BookImage>> GetAllAsync()
    {
        return await dbContext.BookImages.ToListAsync();
    }

    public async Task<BookImage?> GetByIdAsync(int id)
    {
        return await dbContext.BookImages.FindAsync(id);
    }

    public async Task<int> CreateAsync(BookImage entity)
    {
        dbContext.BookImages.Add(entity);
        await dbContext.SaveChangesAsync();
        return entity.ImageId;
    }

    public async Task<bool> UpdateAsync(BookImage entity)
    {
        dbContext.BookImages.Update(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await dbContext.BookImages.FindAsync(id);
        if (entity == null) return false;
        dbContext.BookImages.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
