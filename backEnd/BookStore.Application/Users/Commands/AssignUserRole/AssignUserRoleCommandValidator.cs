using FluentValidation;

namespace BookStore.Application.Users.Commands.AssignUserRole;

public class AssignUserRoleCommandValidator : AbstractValidator<AssignUserRoleCommand>
{
    public AssignUserRoleCommandValidator()
    {
        RuleFor(x => x.UserEmail)
            .NotEmpty().WithMessage("User email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.RoleName)
            .NotEmpty().WithMessage("Role name is required");
    }
}
