using AutoMapper;
using BookStore.Application.Authors.Dtos;
using BookStore.Application.Books.Dtos;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Home;

internal class GetHomeSpotlightQueryHandler
(
    ILogger<GetHomeSpotlightQueryHandler> logger,
    IMapper mapper,
    IBooksRepository booksRepository,
    IAuthorsRepository authorsRepository)
    : IRequestHandler<GetHomeSpotlightQuery, HomeSpotlightDto>

{
    public async Task<HomeSpotlightDto> Handle(GetHomeSpotlightQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting home spotlight");

        var featuredBook = await booksRepository.GetFeaturedOrNewestAsync()
            ?? throw new NotFoundException(nameof(Book), "spotlight");
        int DefaultFallbackAuthorId = 1;
        Author? featuredAuthor = null;
        bool isAuthorFallback = false;

        featuredAuthor = await authorsRepository.GetFeaturedAuthorAsync();

        if (featuredAuthor is null)
        {
            featuredAuthor = await authorsRepository.GetByIdAsync(DefaultFallbackAuthorId);
            if (featuredAuthor != null)
            {
                isAuthorFallback = true;
            }
            if (featuredAuthor is null)
            {
                featuredAuthor = await authorsRepository.GetLastResortAuthorWithBooksAsync();
                if (featuredAuthor != null)
                {
                    isAuthorFallback = true;
                }
            }
        }

        if (featuredAuthor is null)
            throw new NotFoundException(nameof(Author), featuredBook.AuthorId.ToString());

        return new HomeSpotlightDto
        {
            FeaturedBook = mapper.Map<MiniBookDto>(featuredBook),
            FeaturedAuthor = mapper.Map<AuthorDto>(featuredAuthor),
            IsFeaturedBookFallback = false, 
            IsFeaturedAuthorFallback = isAuthorFallback
        };
    }
}
