using FluentValidation;

namespace BookStore.Application.Newsletter;

public class SubscribeNewsletterCommandValidator : AbstractValidator<SubscribeNewsletterCommand>
{
    public SubscribeNewsletterCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(320);
    }
}

public class UnsubscribeNewsletterCommandValidator : AbstractValidator<UnsubscribeNewsletterCommand>
{
    public UnsubscribeNewsletterCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(320);
    }
}
