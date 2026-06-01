using MediatR;

namespace BookStore.Application.Authors.Commands.UnfeatureAuthor;

public class UnfeatureAuthorCommand(int authorId) : IRequest
{
    public int AuthorId { get; set; } = authorId;
}
