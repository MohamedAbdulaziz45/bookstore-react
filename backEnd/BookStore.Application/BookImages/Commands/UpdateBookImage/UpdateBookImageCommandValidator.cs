using FluentValidation;

namespace BookStore.Application.BookImages.Commands.UpdateBookImage;

public class UpdateBookImageCommandValidator : AbstractValidator<UpdateBookImageCommand>
{
    public UpdateBookImageCommandValidator()
    {
        RuleFor(x => x.ImageId).GreaterThan(0).WithMessage("ImageId must be greater than 0");
        RuleFor(x => x.ImageURL).NotEmpty().WithMessage("ImageURL is required");
        RuleFor(x => x.ImageOrder).GreaterThanOrEqualTo(0).WithMessage("ImageOrder cannot be negative");
    }
}
