using FluentValidation;

namespace BookStore.Application.Addresses.Commands.CreateAddress;

public class CreateAddressCommandValidator : AbstractValidator<CreateAddressCommand>
{
    public CreateAddressCommandValidator()
    {
        RuleFor(x => x.Label)
            .NotEmpty().WithMessage("Label is required")
            .MaximumLength(50).WithMessage("Label cannot exceed 50 characters");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("FullName is required")
            .MaximumLength(150).WithMessage("FullName cannot exceed 150 characters");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .MaximumLength(30).WithMessage("Phone cannot exceed 30 characters");

        RuleFor(x => x.AddressLine1)
            .NotEmpty().WithMessage("AddressLine1 is required")
            .MaximumLength(250).WithMessage("AddressLine1 cannot exceed 250 characters");

        RuleFor(x => x.AddressLine2)
            .MaximumLength(250).WithMessage("AddressLine2 cannot exceed 250 characters");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100).WithMessage("City cannot exceed 100 characters");

        RuleFor(x => x.State)
            .MaximumLength(100).WithMessage("State cannot exceed 100 characters");

        RuleFor(x => x.PostalCode)
            .NotEmpty().WithMessage("PostalCode is required")
            .MaximumLength(20).WithMessage("PostalCode cannot exceed 20 characters");

        RuleFor(x => x.Country)
            .NotEmpty().WithMessage("Country is required")
            .Length(2).WithMessage("Country must be a 2-letter country code");
    }
}
