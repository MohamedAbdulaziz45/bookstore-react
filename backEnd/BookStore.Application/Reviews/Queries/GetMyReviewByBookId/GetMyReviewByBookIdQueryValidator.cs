using FluentValidation;

namespace BookStore.Application.Reviews.Queries.GetMyReviewByBookId;

public class GetMyReviewByBookIdQueryValidator : AbstractValidator<GetMyReviewByBookIdQuery>
{
    public GetMyReviewByBookIdQueryValidator()
    {
        RuleFor(x => x.BookId)
            .GreaterThan(0);
    }
}

