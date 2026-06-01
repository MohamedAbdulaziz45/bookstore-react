using FluentValidation;

namespace BookStore.Application.Reviews.Commands.UpdateReview;

public class UpdateReviewCommandValidator : AbstractValidator<UpdateReviewCommand>
{
    public UpdateReviewCommandValidator()
    {
        RuleFor(x => x.ReviewId).GreaterThan(0).WithMessage("ReviewId must be greater than 0");
        RuleFor(x => x.ReviewText).NotEmpty().WithMessage("ReviewText is required");
        RuleFor(x => x.Rating).GreaterThanOrEqualTo(0).WithMessage("Rating cannot be negative");
    }
}
