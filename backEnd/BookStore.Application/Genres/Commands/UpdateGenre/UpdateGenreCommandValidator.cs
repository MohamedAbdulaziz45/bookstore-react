using FluentValidation;

namespace BookStore.Application.Genres.Commands.UpdateGenre;

public class UpdateGenreCommandValidator : AbstractValidator<UpdateGenreCommand>
{
    public UpdateGenreCommandValidator()
    {
        RuleFor(x => x.GenreId).GreaterThan(0).WithMessage("GenreId must be greater than 0");
        RuleFor(x => x.GenreName).NotEmpty().WithMessage("GenreName is required");
    }
}
