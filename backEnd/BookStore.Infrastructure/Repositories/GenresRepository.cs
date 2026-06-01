using BookStore.Application.Genres.Dtos;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Domain.Views;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class GenresRepository(BookStoreDBContext dbContext) : IGenresRepository
{
    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        return await dbContext.Genres.ToListAsync();
    }

    public async Task<IEnumerable<GenreView>> GetAllGenresAndCountAsync()
    {
        return await dbContext.Genres.Select(g => new GenreView
        {
            GenreId = g.GenreId,
            GenreName = g.GenreName,
            ImgUrl = g.ImgUrl,
            Count = g.BookGenres.Count()
        })
        .ToListAsync();

    }
    public async Task<Category?> GetByIdAsync(int id)
    {
        return await dbContext.Genres.FindAsync(id);
    }

    public async Task<int> CreateAsync(Category entity)
    {
        dbContext.Genres.Add(entity);
        await dbContext.SaveChangesAsync();
        return entity.GenreId;
    }

    public async Task<bool> UpdateAsync(Category entity)
    {
        dbContext.Genres.Update(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await dbContext.Genres.FindAsync(id);
        if (entity == null) return false;
        dbContext.Genres.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
