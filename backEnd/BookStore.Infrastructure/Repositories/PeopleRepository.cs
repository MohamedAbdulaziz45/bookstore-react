using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using BookStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories;

internal class PeopleRepository(BookStoreDBContext dbContext) : IPeopleRepository
{
    // CREATE
    public async Task<int> Create(Person entity)
    {
        dbContext.People.Add(entity);
        await dbContext.SaveChangesAsync();
        return entity.PersonId;
    }

    // READ - Get All
    public async Task<IEnumerable<Person>> GetAllAsync()
    {
        return await dbContext.People
            .ToListAsync();
    }

    // READ - Get By ID
    public async Task<Person?> GetByIdAsync(int id)
    {
        return await dbContext.People
            .FirstOrDefaultAsync(p => p.PersonId == id);
    }

    // READ - Get By National Number
    public async Task<Person?> GetByNationalNoAsync(string nationalNo)
    {
        return await dbContext.People
            .FirstOrDefaultAsync(p => p.NationalNo == nationalNo);
    }

    // EXISTS - Check by ID
    public async Task<bool> IsPersonExist(int personId)
    {
        return await dbContext.People
            .AnyAsync(p => p.PersonId == personId);
    }

    // EXISTS - Check by National Number
    public async Task<bool> IsPersonExist(string nationalNo)
    {
        return await dbContext.People
            .AnyAsync(p => p.NationalNo == nationalNo);
    }

    // UPDATE - Save changes for tracked entities
    public async Task SaveChanges()
    {
        await dbContext.SaveChangesAsync();
    }

    // DELETE
    public async Task Delete(Person entity)
    {
        dbContext.People.Remove(entity);
        await dbContext.SaveChangesAsync();
    }
}
