using BookStore.Application.Reviews.Dtos;
using MediatR;
using System.Collections.Generic;

namespace BookStore.Application.Reviews.Queries.GetAllReviewsByBookId;

public class GetAllReviewsByBookIdQuery(int bookId) : IRequest<IEnumerable<ReviewViewDto>>
{
    public int BookId { get; } = bookId;
}
