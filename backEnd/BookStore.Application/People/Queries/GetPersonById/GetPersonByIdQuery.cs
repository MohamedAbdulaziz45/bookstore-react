using BookStore.Application.People.Dtos;
using MediatR;

namespace BookStore.Application.People.Queries.GetPersonById;

public class GetPersonByIdQuery(int id) : IRequest<PersonDto>
{
    public int Id { get; } = id;
}
