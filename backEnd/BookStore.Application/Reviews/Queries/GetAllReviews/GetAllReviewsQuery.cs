using BookStore.Application.Reviews.Dtos;
using MediatR;

namespace BookStore.Application.Reviews.Queries.GetAllReviews;

public class GetAllReviewsQuery : IRequest<IEnumerable<ReviewViewDto>>
{
}
