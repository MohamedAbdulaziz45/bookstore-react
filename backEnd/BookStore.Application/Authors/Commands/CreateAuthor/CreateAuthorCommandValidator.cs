using FluentValidation;

namespace BookStore.Application.Authors.Commands.CreateAuthor;

public class CreateAuthorCommandValidator : AbstractValidator<CreateAuthorCommand>
{
    public CreateAuthorCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required").MaximumLength(150).WithMessage("Name cannot exceed 150 characters");
        RuleFor(x => x.Bio).NotEmpty().WithMessage("Bio is required");
    }
}
