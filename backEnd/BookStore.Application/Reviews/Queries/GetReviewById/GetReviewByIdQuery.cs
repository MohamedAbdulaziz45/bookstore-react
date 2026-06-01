using BookStore.Application.Reviews.Dtos;
using MediatR;

namespace BookStore.Application.Reviews.Queries.GetReviewById;

public class GetReviewByIdQuery(int id) : IRequest<ReviewDto>
{
    public int ReviewId { get; } = id;
}
