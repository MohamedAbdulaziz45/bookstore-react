using FluentValidation;

namespace BookStore.Application.Books.Commands.CreateBook;

public class CreateBookCommandValidator : AbstractValidator<CreateBookCommand>
{
    public CreateBookCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
        RuleFor(x => x.ISBN).NotEmpty().WithMessage("ISBN is required");
        RuleFor(x => x.PublicationDate).NotEmpty().WithMessage("PublicationDate is required");
        RuleFor(x => x.AdditionalDetails).NotEmpty().WithMessage("AdditionalDetails is required");
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative");
        RuleFor(x => x.QuantityInStock).GreaterThanOrEqualTo(0).WithMessage("QuantityInStock cannot be negative");
        RuleFor(x => x.AuthorId).GreaterThan(0).WithMessage("AuthorId must be greater than 0");
        RuleFor(x => x.GenreIds).NotEmpty().WithMessage("At least one genre is required");
        RuleForEach(x => x.GenreIds).GreaterThan(0).WithMessage("GenreId must be greater than 0");
    }
}
