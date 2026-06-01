using BookStore.Application.People.Dtos;
using MediatR;

namespace BookStore.Application.People.Queries.GetAllPeople;

public class GetAllPeopleQuery : IRequest<IEnumerable<PersonDto>>
{
}
