
using BookStore.Application.Carts.Commands.SyncCartItem;
using FluentValidation;

namespace BookStore.Application.Carts.Queries.PreviewCart;

public class PreviewCartQueryValidator : AbstractValidator<PreviewCartQuery>
{
    public PreviewCartQueryValidator(){
        RuleFor(x => x.Items)
        .NotNull().WithMessage("Items are required.")
        .NotEmpty().WithMessage("Items are required.");

        RuleForEach(x => x.Items).SetValidator(new SyncCartItemDtoValidator());
    }
}
