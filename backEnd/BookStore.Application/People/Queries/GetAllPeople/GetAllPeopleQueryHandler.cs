using AutoMapper;
using BookStore.Application.People.Dtos;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.People.Queries.GetAllPeople;

public class GetAllPeopleQueryHandler(ILogger<GetAllPeopleQueryHandler> logger,
IMapper mapper,
IPeopleRepository peopleRepository)
: IRequestHandler<GetAllPeopleQuery, IEnumerable<PersonDto>>
{
    public async Task<IEnumerable<PersonDto>> Handle(GetAllPeopleQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting All people");
        var people = await peopleRepository.GetAllAsync();
        var personDtos = mapper.Map<IEnumerable<PersonDto>>(people);
        return personDtos!;
    }
}
