using AutoMapper;
using BookStore.Application.People.Dtos;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.People.Queries.GetPersonById;

internal class GetPersonByIdQueryHandler(ILogger<GetPersonByIdQueryHandler> logger,
IPeopleRepository peopleRepository
, IMapper mapper) : IRequestHandler<GetPersonByIdQuery, PersonDto>
{
    public async Task<PersonDto> Handle(GetPersonByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting Person {PersonId}", request.Id);

        var person = await peopleRepository.GetByIdAsync(request.Id) ??
        throw new NotFoundException(nameof(Person), request.Id.ToString());
        var personDto = mapper.Map<PersonDto>(person);

        return personDto;
    }
}
