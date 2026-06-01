using MediatR;

namespace BookStore.Application.Reviews.Commands.DeleteReview;

public class DeleteReviewCommand(int id) : IRequest<bool>
{
    public int ReviewId { get; } = id;
}
