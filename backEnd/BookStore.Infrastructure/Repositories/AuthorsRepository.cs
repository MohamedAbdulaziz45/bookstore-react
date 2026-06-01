using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class AuthorsRepository(BookStoreDBContext dbContext) : IAuthorsRepository
{
    public async Task<int> Create(Author entity)
    {
        await dbContext.Authors.AddAsync(entity);
        await dbContext.SaveChangesAsync();
        return entity.AuthorId;
    }

    public async Task<IEnumerable<Author>> GetAllAsync()
    {
        return await dbContext.Authors
            .Include(a => a.Books)
            .ToListAsync();
    }

    public async Task<Author?> GetByIdAsync(int id)
    {
        return await dbContext.Authors
            .Include(a => a.Books)
            .FirstOrDefaultAsync(a => a.AuthorId == id);
    }

    public async Task<Author?> GetFeaturedAuthorAsync()
    {
      return await dbContext.Authors
       .Where(a => a.IsFeatured == true)
       .OrderByDescending(a => a.FeaturedAt)
       .FirstOrDefaultAsync();
    }

    public async Task<Author?> GetLastResortAuthorWithBooksAsync()
    {
        return await dbContext.Authors
          .Where(a => a.Books.Any())
          .OrderBy(a => a.AuthorId)
          .FirstOrDefaultAsync();
    }
    //public async Task<(Author? Author,bool IsFallBack)> GetFeaturedOrFallbackAsync(int? fallbackAuthorId = null)
    //{

    //    /*
    //        var candidates = await dbContext.Authors
    //     .Where(a => a.IsFeatured || a.AuthorId == fallbackAuthorId || a.Books.Any())
    //     .Select(a => new
    //     {
    //         Author = a,
    //         Priority = a.IsFeatured ? 0 : (a.AuthorId == fallbackAuthorId ? 1 : 2),
    //         SortOrder = a.FeaturedAt ?? int.MaxValue
    //     })
    //     .OrderBy(a => a.Priority)
    //     .ThenByDescending(a => a.SortOrder)
    //     .ThenByDescending(a => a.Author.AuthorId)
    //     .FirstOrDefaultAsync();

    //     if (candidates == null)
    //     return (null, true);
         
    //     return (candidates.Author, candidates.Priority > 0);
    //     */
    //    var featuredAuthor = await dbContext.Authors
    //   .Where(a=>a.IsFeatured==true)
    //   .OrderByDescending(a=>a.FeaturedAt)
    //   .FirstOrDefaultAsync();

    //    if (featuredAuthor != null)
    //    {
    //        return (featuredAuthor, false);
    //    }

    //    if(fallbackAuthorId != null)
    //    {
    //        var fallbackAuthor = await dbContext.Authors
    //        .FirstOrDefaultAsync(a=>a.AuthorId == fallbackAuthorId);

    //        if (fallbackAuthor != null)
    //            return (fallbackAuthor, true);
    //    }

    //    var lastResort = await dbContext.Authors
    //    .Where(a=>a.Books.Any())
    //    .OrderByDescending(a=>a.AuthorId)
    //    .FirstOrDefaultAsync();

    //    return (lastResort, true);
    //}
    public async Task<bool> IsAuthorExist(int authorId)
    {
        return await dbContext.Authors.AnyAsync(a => a.AuthorId == authorId);
    }

    public async Task<bool> UpdateAsync(Author entity)
    {
        dbContext.Authors.Update(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task SaveChanges()
    {
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Author entity)
    {
        dbContext.Authors.Remove(entity);
        await dbContext.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await dbContext.Authors.FindAsync(id);
        if (entity == null) return false;
        dbContext.Authors.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
