using FluentValidation;

namespace BookStore.Application.Reviews.Commands.CreateReview;

public class CreateReviewCommandValidator : AbstractValidator<CreateReviewCommand>
{
    public CreateReviewCommandValidator()
    {
        RuleFor(x => x.ReviewText).NotEmpty().WithMessage("ReviewText is required");
        RuleFor(x => x.Rating).GreaterThanOrEqualTo(0).WithMessage("Rating cannot be negative")
                              .LessThanOrEqualTo(5).WithMessage("Rating cannot exceed 5");

        RuleFor(x => x.BookId)
                             .NotEmpty().WithMessage("BookId is required")
                             .GreaterThan(0).WithMessage("BookId must be greater than 0");

    }
}
