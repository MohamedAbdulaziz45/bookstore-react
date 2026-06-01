using MediatR;

namespace BookStore.Application.Reviews.Commands.CreateReview;

public class CreateReviewCommand : IRequest<int>
{
    public string ReviewText { get; set; } = default!;
    public int Rating { get; set; } = default;

    public int BookId { get; set; } = default;

}
