using FluentValidation;

namespace BookStore.Application.Addresses.Commands.DeleteAddress;

public class DeleteAddressCommandValidator : AbstractValidator<DeleteAddressCommand>
{
    public DeleteAddressCommandValidator()
    {
        RuleFor(x => x.AddressId)
            .NotEmpty().WithMessage("AddressId is required")
            .GreaterThan(0).WithMessage("AddressId must be greater than 0");
    }
}
