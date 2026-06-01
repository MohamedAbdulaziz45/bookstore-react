using MediatR;

namespace BookStore.Application.Reviews.Commands.UpdateReview;

public class UpdateReviewCommand : IRequest<bool>
{
    public int ReviewId { get; set; } = default;
    public string ReviewText { get; set; } = default!;
    public int Rating { get; set; } = default;
}
