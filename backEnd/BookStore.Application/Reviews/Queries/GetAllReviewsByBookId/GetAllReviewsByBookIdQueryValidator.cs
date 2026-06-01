using FluentValidation;

namespace BookStore.Application.Reviews.Queries.GetAllReviewsByBookId;

public class GetAllReviewsByBookIdQueryValidator : AbstractValidator<GetAllReviewsByBookIdQuery>
{
    public GetAllReviewsByBookIdQueryValidator()
    {
        RuleFor(x => x.BookId)
         .GreaterThan(0);
    }
}
