using MediatR;

namespace BookStore.Application.Authors.Commands.DeleteAuthor;

public class DeleteAuthorCommand : IRequest<bool>
{
    public int AuthorId { get; set; }
}
