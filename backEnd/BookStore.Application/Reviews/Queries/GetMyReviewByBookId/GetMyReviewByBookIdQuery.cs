using BookStore.Application.Reviews.Dtos;
using MediatR;

namespace BookStore.Application.Reviews.Queries.GetMyReviewByBookId;

public class GetMyReviewByBookIdQuery(int bookId) : IRequest<ReviewDto?>
{
    public int BookId { get; } = bookId;
}

