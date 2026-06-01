using BookStore.Domain.Entities;

namespace BookStore.Domain.Repositories;

public interface IPeopleRepository
{
    Task<IEnumerable<Person>> GetAllAsync();
    Task<Person?> GetByIdAsync(int id);
    Task<Person?> GetByNationalNoAsync(string NationalNo);
    Task<int> Create(Person entity);
    Task Delete(Person entity);
    Task SaveChanges();
    Task<bool> IsPersonExist(int PersonId);
    Task<bool> IsPersonExist(string NationalNo);
}
