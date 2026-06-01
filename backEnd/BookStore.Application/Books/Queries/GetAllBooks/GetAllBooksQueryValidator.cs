using BookStore.Domain.Views;
using FluentValidation;

namespace BookStore.Application.Books.Queries.GetAllBooks;

public class GetAllBooksQueryValidator : AbstractValidator<GetAllBooksQuery>
{
    private int[] allowedPageSizes = [4, 8, 12, 24];
    private string[] allowedSortByColumnNames =
    [
        nameof(BookView.Title),
        nameof(BookView.Price),
        nameof(BookView.Author),
        nameof(BookView.Rating),
        nameof(BookView.PublicationDate),
    ];

    public GetAllBooksQueryValidator()
    {
        RuleFor(r => r.PageNumber)
            .GreaterThanOrEqualTo(1);

        RuleFor(r => r.PageSize)
            .Must(value => allowedPageSizes.Contains(value))
            .WithMessage($"Page size must be in [{string.Join(",", allowedPageSizes)}]");

        RuleFor(r => r.SortBy)
            .Must(value => allowedSortByColumnNames.Contains(value))
            .When(q => q.SortBy != null)
            .WithMessage($"Sort by is optional, or must be in [{string.Join(",", allowedSortByColumnNames)}]");
    }
}
