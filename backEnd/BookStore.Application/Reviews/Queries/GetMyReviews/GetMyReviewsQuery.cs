using BookStore.Application.Reviews.Dtos;
using MediatR;

namespace BookStore.Application.Reviews.Queries.GetMyReviews;

public class GetMyReviewsQuery : IRequest<IEnumerable<ReviewDto>>
{
}

