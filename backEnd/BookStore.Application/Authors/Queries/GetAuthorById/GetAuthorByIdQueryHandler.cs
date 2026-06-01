using AutoMapper;
using BookStore.Application.Authors.Dtos;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Authors.Queries.GetAuthorById;

internal class GetAuthorByIdQueryHandler(ILogger<GetAuthorByIdQueryHandler> logger, IMapper mapper, IAuthorsRepository repository) : IRequestHandler<GetAuthorByIdQuery, AuthorDto>
{
    public async Task<AuthorDto> Handle(GetAuthorByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Getting Author by ID {request.Id}");
        var entity = await repository.GetByIdAsync(request.Id);
        
        if (entity == null)
            throw new NotFoundException(nameof(Author), request.Id.ToString());

        return mapper.Map<AuthorDto>(entity);
    }
}
