using AutoMapper;
using BookStore.Application.Authors.Dtos;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace BookStore.Application.Authors.Queries.GetAllAuthors;

internal class GetAllAuthorsQueryHandler(ILogger<GetAllAuthorsQueryHandler> logger, IMapper mapper, IAuthorsRepository repository) : IRequestHandler<GetAllAuthorsQuery, IEnumerable<AuthorDto>>
{
    public async Task<IEnumerable<AuthorDto>> Handle(GetAllAuthorsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all Authors");
        var entities = await repository.GetAllAsync();
        return mapper.Map<IEnumerable<AuthorDto>>(entities);
    }
}
