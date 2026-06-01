using FluentValidation;

namespace BookStore.Application.BookImages.Commands.CreateBookImage;

public class CreateBookImageCommandValidator : AbstractValidator<CreateBookImageCommand>
{
    public CreateBookImageCommandValidator()
    {
        RuleFor(x => x.ImageURL).NotEmpty().WithMessage("ImageURL is required");
        RuleFor(x => x.ImageOrder).GreaterThanOrEqualTo(0).WithMessage("ImageOrder cannot be negative");
    }
}
