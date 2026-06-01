using AutoMapper;
using BookStore.Application.BookImages.Dtos;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.BookImages.Queries.GetBookImageById;

internal class GetBookImageByIdQueryHandler(ILogger<GetBookImageByIdQueryHandler> logger, IMapper mapper, IBookImagesRepository repository) : IRequestHandler<GetBookImageByIdQuery, BookImageDto>
{
    public async Task<BookImageDto> Handle(GetBookImageByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Getting BookImage {request.ImageId}");
        var entity = await repository.GetByIdAsync(request.ImageId);
        
        if (entity == null)
            throw new NotFoundException(nameof(BookImage), request.ImageId.ToString());
            
        return mapper.Map<BookImageDto>(entity);
    }
}
