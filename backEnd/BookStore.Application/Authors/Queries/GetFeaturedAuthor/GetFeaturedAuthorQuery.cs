using BookStore.Application.Authors.Dtos;
using MediatR;

namespace BookStore.Application.Authors.Queries.GetFeaturedAuthor;

public class GetFeaturedAuthorQuery : IRequest<FeaturedAuthorDto>
{
}
