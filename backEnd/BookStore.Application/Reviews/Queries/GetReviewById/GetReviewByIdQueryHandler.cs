using AutoMapper;
using BookStore.Application.Reviews.Dtos;
using BookStore.Domain.Entities;
using BookStore.Domain.Exceptions;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BookStore.Application.Reviews.Queries.GetReviewById;

internal class GetReviewByIdQueryHandler(ILogger<GetReviewByIdQueryHandler> logger, IMapper mapper, IReviewsRepository repository) : IRequestHandler<GetReviewByIdQuery, ReviewDto>
{
    public async Task<ReviewDto> Handle(GetReviewByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Getting Review {request.ReviewId}");
        var entity = await repository.GetByIdAsync(request.ReviewId);
        
        if (entity == null)
            throw new NotFoundException(nameof(Review), request.ReviewId.ToString());
            
        return mapper.Map<ReviewDto>(entity);
    }
}
