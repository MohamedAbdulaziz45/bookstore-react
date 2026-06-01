using FluentValidation;

namespace BookStore.Application.Authors.Commands.UnfeatureAuthor;

public class UnfeatureAuthorCommandValidator : AbstractValidator<UnfeatureAuthorCommand>
{
    public UnfeatureAuthorCommandValidator()
    {
        RuleFor(x => x.AuthorId).GreaterThan(0);
    }
}
