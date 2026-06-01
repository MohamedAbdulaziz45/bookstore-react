using FluentValidation;

namespace BookStore.Application.Genres.Commands.CreateGenre;

public class CreateGenreCommandValidator : AbstractValidator<CreateGenreCommand>
{
    public CreateGenreCommandValidator()
    {
        RuleFor(x => x.GenreName).NotEmpty().WithMessage("GenreName is required");
    }
}
