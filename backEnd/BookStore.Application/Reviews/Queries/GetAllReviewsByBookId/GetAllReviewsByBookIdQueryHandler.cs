using AutoMapper;
using BookStore.Application.Reviews.Dtos;
using BookStore.Application.Reviews.Queries.GetAllReviews;
using BookStore.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;


namespace BookStore.Application.Reviews.Queries.GetAllReviewsByBookId;

internal class GetAllReviewsbyBookIdQueryHandler(
ILogger<GetAllReviewsbyBookIdQueryHandler> logger,
IMapper mapper,
IReviewsRepository repository) 
: IRequestHandler<GetAllReviewsByBookIdQuery, IEnumerable<ReviewViewDto>>
{

    public async Task<IEnumerable<ReviewViewDto>> Handle(GetAllReviewsByBookIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all Reviews");
        var entities = await repository.GetAllViewByBookIdAsync(request.BookId);


        return mapper.Map<IEnumerable<ReviewViewDto>>(entities);
    }
}
