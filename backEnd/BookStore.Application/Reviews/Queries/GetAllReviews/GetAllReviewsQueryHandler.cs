using AutoMapper;
using BookStore.Application.Reviews.Dtos;
using BookStore.Domain.Repositories;
using BookStore.Domain.Views;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace BookStore.Application.Reviews.Queries.GetAllReviews;

internal class GetAllReviewsQueryHandler(ILogger<GetAllReviewsQueryHandler> logger, IMapper mapper, IReviewsRepository repository) : IRequestHandler<GetAllReviewsQuery, IEnumerable<ReviewViewDto>>
{
    public async Task<IEnumerable<ReviewViewDto>> Handle(GetAllReviewsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all Reviews");
        var entities = await repository.GetAllViewAsync();


        return mapper.Map<IEnumerable<ReviewViewDto>>(entities);
    }
}
