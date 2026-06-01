using AutoMapper;
using BookStore.Application.Authors.Dtos;
using BookStore.Domain.Entities;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Authors.Queries.GetFeaturedAuthor;

internal class GetFeaturedAuthorQueryHandler(
    ILogger<GetFeaturedAuthorQueryHandler> logger,
    IMapper mapper,
    IAuthorsRepository authorsRepository)
    : IRequestHandler<GetFeaturedAuthorQuery, FeaturedAuthorDto>
{
    public async Task<FeaturedAuthorDto> Handle(GetFeaturedAuthorQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting Featured author");

        int DefaultFallbackAuthorId = 1;
        Author? author = null;
        bool isFallback = false;

        author = await authorsRepository.GetFeaturedAuthorAsync();

        if (author is null)
        {
            author = await authorsRepository.GetByIdAsync(DefaultFallbackAuthorId);
            if (author != null)
            {
                isFallback = true;
            }
            if (author is null)
            {
                author = await authorsRepository.GetLastResortAuthorWithBooksAsync();
                if (author != null)
                {
                    isFallback = true;
                }
            }
        }

        return new FeaturedAuthorDto
        {
            Author = mapper.Map<AuthorDto>(author),
            IsFallback = isFallback
        };
    }

}

