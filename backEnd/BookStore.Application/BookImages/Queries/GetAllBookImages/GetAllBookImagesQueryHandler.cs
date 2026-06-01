using AutoMapper;
using BookStore.Application.BookImages.Dtos;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace BookStore.Application.BookImages.Queries.GetAllBookImages;

internal class GetAllBookImagesQueryHandler(ILogger<GetAllBookImagesQueryHandler> logger, IMapper mapper, IBookImagesRepository repository) : IRequestHandler<GetAllBookImagesQuery, IEnumerable<BookImageDto>>
{
    public async Task<IEnumerable<BookImageDto>> Handle(GetAllBookImagesQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all BookImages");
        var entities = await repository.GetAllAsync();
        return mapper.Map<IEnumerable<BookImageDto>>(entities);
    }
}
