using FluentValidation;

namespace BookStore.Application.Authors.Commands.FeatureAuthor;

public class FeatureAuthorCommandValidator : AbstractValidator<FeatureAuthorCommand>
{
    public FeatureAuthorCommandValidator()
    {
        RuleFor(x => x.AuthorId).GreaterThan(0);
    }
}
