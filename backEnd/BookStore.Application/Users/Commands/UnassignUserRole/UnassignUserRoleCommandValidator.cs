using FluentValidation;

namespace BookStore.Application.Users.Commands.UnassignUserRole;

public class UnassignUserRoleCommandValidator : AbstractValidator<UnassignUserRoleCommand>
{
    public UnassignUserRoleCommandValidator()
    {
        RuleFor(x => x.UserEmail)
            .NotEmpty().WithMessage("User email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.RoleName)
            .NotEmpty().WithMessage("Role name is required");
    }
}
