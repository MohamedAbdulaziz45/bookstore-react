using FluentValidation;

namespace BookStore.Application.Addresses.Commands.SetDefaultAddress;

public class SetDefaultAddressCommandValidator : AbstractValidator<SetDefaultAddressCommand>
{
    public SetDefaultAddressCommandValidator()
    {
        RuleFor(x => x.AddressId)
            .NotEmpty().WithMessage("AddressId is required")
            .GreaterThan(0).WithMessage("AddressId must be greater than 0");
    }
}
