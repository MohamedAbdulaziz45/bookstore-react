using FluentValidation;

namespace BookStore.Application.Authors.Commands.UpdateAuthor;

public class UpdateAuthorCommandValidator : AbstractValidator<UpdateAuthorCommand>
{
    public UpdateAuthorCommandValidator()
    {
        RuleFor(x => x.AuthorId).NotEmpty().WithMessage("AuthorId is required");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required").MaximumLength(150).WithMessage("Name cannot exceed 150 characters");
        RuleFor(x => x.Bio).NotEmpty().WithMessage("Bio is required");
    }
}
