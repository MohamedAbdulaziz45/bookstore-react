using MediatR;

namespace BookStore.Application.Authors.Commands.FeatureAuthor;

public class FeatureAuthorCommand(int authorId):IRequest
{
    public int AuthorId { get; set; } = authorId;
}
