using FluentValidation;

namespace BookStore.Application.Carts.Commands.AddOrUpdateCartItem;

public class AddOrUpdateCartItemCommandValidator : AbstractValidator<AddOrUpdateCartItemCommand>
{
    public AddOrUpdateCartItemCommandValidator()
    {
        RuleFor(x => x.BookId)
            .NotEmpty().WithMessage("BookId is required")
            .GreaterThan(0).WithMessage("BookId must be greater than 0");

        RuleFor(x => x.QuantityChange)
            .NotEqual(0).WithMessage("QuantityChange cannot be zero")
            .NotEmpty().WithMessage("QuantityChange is required");
    }
}
