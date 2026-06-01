using FluentValidation;

namespace BookStore.Application.Customers.Commands.CreateCustomer;

public class CreateCustomerCommandValidator : AbstractValidator<CreateCustomerCommand>
{
    public CreateCustomerCommandValidator()
    {
        RuleFor(x => x.MemeberSince).NotEmpty().WithMessage("MemeberSince is required");
        RuleFor(x => x.UserId).NotEmpty().WithMessage("UserId is required");
    }
}
