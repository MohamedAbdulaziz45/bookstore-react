using FluentValidation;

namespace BookStore.Application.Customers.Commands.UpdateCustomer;

public class UpdateCustomerCommandValidator : AbstractValidator<UpdateCustomerCommand>
{
    public UpdateCustomerCommandValidator()
    {
        RuleFor(x => x.CustomerId).GreaterThan(0).WithMessage("CustomerId must be greater than 0");
        RuleFor(x => x.MemeberSince).NotEmpty().WithMessage("MemeberSince is required");
        RuleFor(x => x.UserId).NotEmpty().WithMessage("UserId is required");
    }
}
