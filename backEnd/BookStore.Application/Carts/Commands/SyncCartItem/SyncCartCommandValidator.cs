

using BookStore.Application.Carts.Dtos;
using FluentValidation;

namespace BookStore.Application.Carts.Commands.SyncCartItem;

public class SyncCartCommandValidator: AbstractValidator<SyncCartCommand>
{
  public SyncCartCommandValidator()
  {
        RuleFor(x => x.Items)
            .NotNull().WithMessage("Items are required.")
            .NotEmpty().WithMessage("Items are required.");

        RuleForEach(x => x.Items).SetValidator(new SyncCartItemDtoValidator());
    }
}
public class SyncCartItemDtoValidator : AbstractValidator<SyncCartItemDto>
{
    public SyncCartItemDtoValidator()
    {
        RuleFor(x => x.BookId)
            .GreaterThan(0).WithMessage("BookId must be greater than 0.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0.");
    }
}