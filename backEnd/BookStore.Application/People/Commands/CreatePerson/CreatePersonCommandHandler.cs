using AutoMapper;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.People.Commands.CreatePerson;

internal class CreatePersonCommandHandler(ILogger<CreatePersonCommandHandler> logger,
IMapper mapper
, IPeopleRepository peopleRepository)
: IRequestHandler<CreatePersonCommand, int>
{
    public async Task<int> Handle(CreatePersonCommand request, CancellationToken cancellationToken)
    {
        var person = mapper.Map<Person>(request);
        int id = await peopleRepository.Create(person);

        return id;
    }
}
